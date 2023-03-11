import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IndexerService} from '../../indexer.service';
import {JwtService} from '../../../auth/services/jwt.service';
import {OpsHelpDialog} from '../help/help.component';
import {ContactDialog} from '../../../header/header.component';
import {MatDialog} from '@angular/material/dialog';
import {WorldService} from '../../../services/world.service';
import {Command} from './command';
import {Globals} from '../../../globals';
import {Title} from '@angular/platform-browser';
import {OpsIntelDialog} from '../intel-dialog/intel-dialog.component';
import {LocalCacheService} from '../../../services/local-cache.service';
import * as jwt_decode from 'jwt-decode';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {IndexMembersDialog} from '../../../shared/dialogs/index-members/index-members.component';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.scss'],
  providers: [IndexerService, WorldService, LocalCacheService]
})
export class CommandsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('commentPusher') private commentPusher: ElementRef;

  team
  world
  team_name
  is_admin = false;
  share_link = '';
  my_uid = 0;

  // Data
  towns: any = []
  players: any = []
  uploaders: any = []
  commands: Command[] = []

  // Data loading logic
  loading = true;
  active_title = '';
  refreshing = false;
  animate_refresh = true;
  sync_status = 'LOADING'
  error:any = false
  command_loading_interval
  command_last_load_unix = 0
  command_last_poll_local = 0
  command_poll_frequency_options = [5, 10, 15, 30, 60];
  command_poll_frequency = 15 // poll every n seconds for new commands
  next_refresh = 0;  // seconds until next refresh

  // Selected command editing logic
  selected_command: Command = null;
  user_can_edit_selected_command = false;
  comment_input = '';
  loading_delete = false;
  delete_error = '';
  loading_comment = false;
  comment_error = '';

  // Filters & order
  is_filtered = false;
  showCancelTime = false;
  showDeletedCommands = false;
  command_types = ['attack_land', 'support', 'attack_sea', 'attack_spy', 'farm_attack', 'abort', 'revolt', 'attack_takeover', 'breakthrough', 'portal_attack_olympus', 'portal_support_olympus'];
  command_type_toggle: any = {};
  filter_order = 'arrival_asc'
  filter_text = ''
  filter_comment = ''
  filter_town = []
  filter_player = []
  filter_uploader = []
  typingTimer;
  debounceTime = 500;
  dropdownSettingsPlayers: IDropdownSettings = {};
  dropdownSettingsTowns: IDropdownSettings = {};
  dropdownSettingsUploaders: IDropdownSettings = {};

  // Timing logic
  current_time;  // This is a unix timestamp representing the current UTC time
  game_time;  // This is a timestamp representing the game server time
  game_time_string;  // This is a human readable time representing the game server time
  world_unix_offset = 0;  // This is given by backend: current_time + world_unix_offset = current grepolis server time
  timer_refresh_interval

  constructor(
    public dialog: MatDialog,
    private globals: Globals,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private authService: JwtService,
    private indexerService: IndexerService,
    private titleService: Title,
  ) { }

  /**
   * === Setup & Initialization
   */

  ngOnInit(): void {
    this.syncMainTimer();

    this.route.params.subscribe((params) => this.initialize(params));

    let dropdownSettings = {
      singleSelection: false,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true,
      enableCheckAll: false
    };
    this.dropdownSettingsPlayers = dropdownSettings;
    this.dropdownSettingsTowns = dropdownSettings;
    this.dropdownSettingsUploaders = dropdownSettings;
  }

  ngAfterViewInit() {
    this.cdr.detach();
  }

  ngOnDestroy() {
    clearInterval(this.timer_refresh_interval);
    clearInterval(this.command_loading_interval);
  }

  initialize(params) {
    this.team = params.team;
    this.team_name = params.team;
    this.world = params.world;
    this.loading = true;
    this.refreshing = false;
    this.sync_status = 'LOADING'
    this.syncMainTimer();
    this.resetTypeFilter();
    this.getSettingsFromCache();
    this.draw();

    // Do the first command pull
    this.loadCommands();

    // Start polling for commands
    this.restartPollingCommands(this.command_poll_frequency);

    // Get index info
    this.authService.accessToken().then(access_token => {
      this.indexerService.getIndex(access_token, this.team, true).subscribe(
        (response) => this.parseIndexResponse(response)
      );

      let payload = jwt_decode(access_token);
      if (payload && 'uid' in payload) {
        this.my_uid = payload.uid;
      }

    });

    // Timer interval
    this.timer_refresh_interval = setInterval(_ => {this.updateTimer()}, 1000);
  }

  /**
   * === Drawing & update logic
   */

  draw() {
    this.cdr.detectChanges();
  }

  softNotification(message, title = '', lifetime=5000) {
    this.globals.showSnackbar(
      `<h4>`+message+`</h4>`,
      'success', title, true,lifetime);
  }

  /**
   * === Data loading
   */

  restartPollingCommands(frequency_seconds) {
    // TODO: change frequency depending on how many commands arrive within the next n minutes
    console.log("changing poll frequency to", frequency_seconds);
    clearInterval(this.command_loading_interval);
    this.command_loading_interval = setInterval(_ => {this.loadCommands()}, frequency_seconds*1000);
    this.command_last_poll_local = this.current_time;
  }

  loadCommands() {
    if (this.refreshing) {
      console.log('Already pulling');
      return;
    }
    console.log("Pulling new commands from server. last get: ", this.command_last_load_unix);

    this.refreshing = true;
    this.animate_refresh = true;
    let that = this;
    setTimeout(function() {
      that.animate_refresh = false;
    }, 1000);
    this.draw();

    this.authService.accessToken().then(access_token => {
      this.indexerService.getCommandOverview(access_token, this.team, this.command_last_load_unix).subscribe(
        response => this.parseCommandResponse(response),
        error => this.parseCommandResponse(error),
      );
    });
  }

  parseIndexResponse(response) {
    this.team_name = response.index_name;
    this.is_admin = response.is_admin;
    this.share_link = response.share_link??'';
    this.world_unix_offset = response.unix_offset;
    this.draw();
  }

  trackCommandByFn(index, command: Command) {
    return command.cmd_id + command.arrival_at
  }

  parseCommandResponse(response) {
    console.log('commands response: ', response);
    this.command_last_poll_local = this.current_time;

    if ('updated_at' in response) {
      this.command_last_load_unix = response.updated_at;
    }

    let stopPolling = false;
    this.error = false;
    if (response.status === 401) {
      // Unauthorized
      console.log('Redirecting to login');
      this.sync_status = 'Forbidden';
      stopPolling = true;
      this.authService.logout();
    } else if (response.status === 503) {
      // Killswitch active
      this.error = 'Service unavailable';
      if (response.error && 'message' in response.error) {
        this.error = response.error.message;
      }
      this.sync_status = 'Service Unavailable';
      this.commands = [];
      this.selected_command = null;
      stopPolling = true;
    } else if (response.status === 429) {
      // Rate limit exceeded. ignore.
      console.log('Rate limit exceeded');
      this.sync_status = 'Rate limited';
    } else if ('error_code' in response) {
      switch (response.error_code) {
        case 7101:
          // Invalid team
          this.error = 'Invalid team.';
          this.sync_status = 'Invalid team';
          stopPolling = true;
          break;
        case 7504:
          // Unauthorized to read from team
          this.error = 'You do not have access to this team.';
          this.sync_status = 'Unauthorized';
          stopPolling = true;
          break;
        case 8020:
          // No active commands; nominal
          this.sync_status = 'LIVE';
          break;
        default:
          this.error = 'Unable to load commands.';
          this.sync_status = 'Out of Sync';
      }
    } else if ('success_code' in response && response.success_code == 8000) {
      if (response.count > 0) {
        // Server responds with commands that have been updated since this.command_last_load_unix
        let updated_commands: Command[] = response.items;
        let updated_command_ids = updated_commands.map(c => c.cmd_id);

        // Keep old commands
        let old_commands = this.commands.filter(command => {
          // If an updated_command has a hard delete status, this will also ensure that it is removed from the set of old_commands
          return updated_command_ids.indexOf(command.cmd_id) < 0;
        });

        // Remove hard deleted commands from the updated commands
        updated_commands = updated_commands.filter(command => {
          return command.delete_status != 'hard';
        });

        // Merge the 2 command sets
        this.commands = [...updated_commands, ...old_commands];

        // Sort the commands
        this.sortCommands(false);

        // reapply filter logic
        this.filterCommands(false);

        // Update ETA
        this.updateTimer(false);

        // Update selected command
        if (this.selected_command) {
          this.commands.forEach(command => {
            if (command.cmd_id == this.selected_command.cmd_id) {
              console.log("setting selected command!");
              this.selected_command = command;
            }
          });
          this.scrollComments();
        }
      } else {
        // No new commands
        console.log("No new commands");
      }
      this.sync_status = 'LIVE';
    } else if ('success_code' in response && response.success_code == 8010) {
      // No new commands
      console.log("No new commands");
      this.sync_status = 'LIVE';
    } else {
      this.sync_status = 'Out of Sync';
    }

    // Update title
    let num_commands = this.commands.length
    if (num_commands <= 0) {
      this.updateTitle("⚫ LIVE Ops: no active commands");
    } else {
      this.updateTitle("🔴 LIVE Ops: "+num_commands+" command"+(num_commands!=1?'s':''));
    }

    // Rebuild filter options
    this.buildFilterOptions();

    if (this.loading && this.error == false) {
      // First pass
      this.softNotification("Connected. You are now viewing live data", "", 5000);
    }

    if (stopPolling) {
      clearInterval(this.command_loading_interval);
    }

    this.loading = false;
    this.refreshing = false;
    this.draw();
  }

  updateTitle(new_title) {
    if (new_title != this.active_title) {
      this.active_title = new_title;
      this.titleService.setTitle(new_title);
    }
  }

  /**
   * === Filter & sort logic
   */

  filterText() {
    clearTimeout(this.typingTimer);
    let that = this;
    this.typingTimer = setTimeout(function () {
      that.doFilter();
    }, this.debounceTime);
  }

  filterExpired() {
    this.commands = this.commands.filter(command => {
      return command.arrival_at >= this.current_time;
    });
  }

  doSort() {
    this.sortCommands();
    setTimeout(_ => this.saveSettingsToCache(), 300);
  }

  doFilter() {
    this.filterCommands();
    setTimeout(_ => this.saveSettingsToCache(), 300);
  }

  doChangeFrequency() {
    this.restartPollingCommands(this.command_poll_frequency);
    setTimeout(_ => this.saveSettingsToCache(), 300);
  }

  doSettings() {
    this.draw();
    setTimeout(_ => this.saveSettingsToCache(), 300);
  }

  buildFilterOptions() {
    let player_bins = {};
    let town_bins = {}
    let uploader_bins = {}

    this.commands.forEach(command => {
      player_bins[command.src_ply_n] ? player_bins[command.src_ply_n] += 1 : player_bins[command.src_ply_n] = 1;
      player_bins[command.trg_ply_n] ? player_bins[command.trg_ply_n] += 1 : player_bins[command.trg_ply_n] = 1;

      town_bins[command.src_twn_n] ? town_bins[command.src_twn_n] += 1 : town_bins[command.src_twn_n] = 1;
      town_bins[command.trg_twn_n] ? town_bins[command.trg_twn_n] += 1 : town_bins[command.trg_twn_n] = 1;

      uploader_bins[command.upload_n] ? uploader_bins[command.upload_n] += 1 : uploader_bins[command.upload_n] = 1;
    })

    this.players = Object.keys(player_bins).filter(n => n != '').map(player => { return {text: player + " (" + player_bins[player] + ")", id: player}});
    this.towns = Object.keys(town_bins).filter(n => n != '').map(town => { return {text: town + " (" + town_bins[town] + ")", id: town}});
    this.uploaders = Object.keys(uploader_bins).map(uploader => { return {text: uploader + " (" + uploader_bins[uploader] + ")", id: uploader}});

    // let attackers = [...new Set(this.commands.map((command) => command.src_ply_n))];
    // let defenders = [...new Set(this.commands.map((command) => command.trg_ply_n))];
    // this.players = [...(new Set([...attackers, ...defenders]))].sort().filter(n => n != '')
    //
    // let target_towns = [...new Set(this.commands.map((command) => command.trg_twn_n))];
    // let source_towns = [...new Set(this.commands.map((command) => command.src_twn_n))];
    // this.towns = [...(new Set([...target_towns, ...source_towns]))].sort().filter(n => n != '')
    //
    // this.uploaders = [...new Set(this.commands.map((command) => command.upload_n))].sort().filter(n => n != '')
  }

  clearFilter(key='all', do_draw = true) {
    switch (key) {
      case 'text':
        this.filter_text = '';
        break;
      case 'comment':
        this.filter_comment = '';
        break;
      case 'town':
        this.filter_town = [];
        break;
      case 'player':
        this.filter_player = [];
        break;
      case 'uploader':
        this.filter_uploader = [];
        break;
      case 'all':
      default:
        this.filter_text = '';
        this.filter_comment = '';
        this.filter_town = [];
        this.filter_player = [];
        this.filter_uploader = [];
    }
    this.resetTypeFilter();

    this.filterCommands();

    if (do_draw) {
      this.draw();
    }

    this.saveSettingsToCache();
  }

  resetTypeFilter () {
    this.command_type_toggle = {}
    this.command_types.forEach(x => {this.command_type_toggle[x] = true });
  }

  isFiltered() {
    if (
      this.filter_text != ''
      || this.filter_comment != ''
      || this.filter_town.length > 0
      || this.filter_player.length > 0
      || this.filter_uploader.length > 0
      || Object.values(this.command_type_toggle).reduce((a: any, b: any) => a + b, 0) != this.command_types.length
    ) {
      return true
    }
    return false;
  }

  sortCommands(do_draw = true) {
    this.commands.sort((c1, c2) => {
      let sort = 0;
      if (c1.arrival_at == c2.arrival_at) {
        // If arrival is in the same second, the lower command id arrives earlier
        sort = c1.cmd_id < c2.cmd_id ? -1 : 1
      } else {
        sort = c1.arrival_at < c2.arrival_at ? -1 : 1
      }

      if (this.filter_order == 'arrival_desc') {
        // Descending
        return -sort;
      } else {
        // Ascending
        return sort;
      }
    });

    if (do_draw) {
      this.draw();
    }
  }

  toggleCommandTypeFilter(command_type) {
    this.command_type_toggle[command_type] = !this.command_type_toggle[command_type];
    this.filterCommands();
    this.draw();
  }

  filterCommands(do_draw = true) {
    this.is_filtered = this.isFiltered();
    if (this.is_filtered) {
      console.log('applying filters');
      this.commands.map(command => {
        let hidden = false;

        if (this.filter_text != '') {
          let search_domain = command.src_ply_n + command.src_twn_n + command.trg_ply_n + command.trg_twn_n
          // Add comments to search domain
          if ('comments' in command) {
            search_domain += command.comments.map(comment => comment.text).join()
          }
          if (!search_domain.toLocaleLowerCase().includes(this.filter_text)) {
            hidden = true;
          }
        }
        // if (this.filter_comment != '') {
        //   let search_domain = command.comments.map(comment => comment.text).join()
        //   if (!search_domain.toLocaleLowerCase().includes(this.filter_comment)) {
        //     hidden = true;
        //   }
        // }
        if (this.filter_player.length > 0) {
          let player_names = this.filter_player.map(filter => filter.id)
          if (player_names.indexOf(command.trg_ply_n) < 0 && player_names.indexOf(command.src_ply_n) < 0) {
            hidden = true;
          }
        }
        if (this.filter_town.length > 0) {
          let town_names = this.filter_town.map(filter => filter.id)
          if (town_names.indexOf(command.trg_twn_n) < 0 && town_names.indexOf(command.src_twn_n) < 0) {
            hidden = true;
          }
        }
        if (this.filter_uploader.length > 0) {
          let uploader_names = this.filter_uploader.map(filter => filter.id)
          if (uploader_names.indexOf(command.upload_n) < 0) {
            hidden = true;
          }
        }
        if (this.command_types.indexOf(command.type) >= 0 && this.command_type_toggle[command.type] === false) {
          hidden = true;
        } else if ((command.type == 'attack') && this.command_type_toggle['attack_land'] === false) {
          hidden = true;
        } else if (command.type == 'foundation' && this.command_type_toggle['attack_takeover'] === false) {
          hidden = true;
        }

        command.hidden = hidden;
        return command;
      });

    } else {
      this.commands.map(command => {
        command.hidden = false;
        return command;
      });
    }

    if (do_draw) {
      this.draw();
    }
  }

  /**
   * === Local caching logic
   */

  saveSettingsToCache() {
    console.log('setting filters');
    let filters = {
      filter_text: this.filter_text,
      filter_player: this.filter_player,
      filter_town: this.filter_town,
      filter_order: this.filter_order,
      filter_uploader: this.filter_uploader,
      showCancelTime: this.showCancelTime,
      showDeletedCommands: this.showDeletedCommands,
      command_poll_frequency: this.command_poll_frequency,
    }
    LocalCacheService.set('cmd_settings', filters);
  }

  getSettingsFromCache() {
    let filters = LocalCacheService.get('cmd_settings', true);
    if (filters && 'filter_text' in filters) {
      console.log("Retrieved cmd settings from cache:", filters);
      this.filter_text = filters.filter_text;
      this.filter_player = filters.filter_player;
      this.filter_town = filters.filter_town;
      this.filter_order = filters.filter_order;
      this.filter_uploader = filters.filter_uploader;
      this.showCancelTime = filters.showCancelTime;
      this.showDeletedCommands = filters.showDeletedCommands;
      this.command_poll_frequency = filters.command_poll_frequency;
    }
  }

  /**
   * === Command update Logic
   */

  selectCommand(command: Command) {
    if (this.selected_command && 'cmd_id' in this.selected_command && command.cmd_id == this.selected_command.cmd_id) {
      // unselect!
      this.selected_command = null;
    } else {
      this.selected_command = command;
      this.user_can_edit_selected_command = this.is_admin || (this.selected_command.upload_uid == this.my_uid)
    }
    this.comment_error = '';
    this.loading_comment = false;
    this.delete_error = '';
    this.loading_delete = false;
    this.draw();
    try {
      this.commentPusher.nativeElement.scrollIntoView(false)
      this.draw();
    } catch (e) { }
  }

  deleteCommand(es_id, new_delete_status) {
    if (this.loading_delete) {
      return;
    }
    this.loading_delete = true;
    this.draw();
    this.authService.accessToken().then(access_token => {
      this.indexerService.updateCommandDeleteStatus(access_token, this.team, this.world, es_id, new_delete_status).subscribe(
        (response) => this.parseCommandUpdateResponse(response, 'delete'),
        (error) => this.parseCommandUpdateResponse(error, 'delete')
      );
    });
  }

  submitComment(es_id) {
    if (this.loading_comment) {
      return;
    }

    let comment = this.comment_input;
    if (comment.length <= 0) {
      this.comment_error = 'Enter a comment first'
      this.draw();
      return;
    } else if (comment.length > 500) {
      this.comment_error = 'Comment is too big.'
      this.draw();
      return;
    } else {
      this.loading_comment = true;
    }
    this.draw();

    this.authService.accessToken().then(access_token => {
      this.indexerService.addCommandComment(access_token, this.team, this.world, es_id, comment).subscribe(
        (response) => this.parseCommandUpdateResponse(response, 'comment'),
        (error) => this.parseCommandUpdateResponse(error, 'comment')
      );
    });
  }

  parseCommandUpdateResponse(response, action) {
    console.log('command update response: ', action, response);
    let error = '';
    if (response && 'error_code' in response) {
      switch (response.error_code) {
        case 7504:
          // User does not have read access on this team
          error = 'Unauthorized: you do not have access to this team.';
          break;
        case 8120:
          // User is not an admin
          error = 'Unauthorized: you need to be a team admin to perform this action.';
          if (action == 'delete') {
            error = 'Unauthorized: you need to be an admin to delete commands of other players.';
          }
          break;
        case 8110:
          // Invalid action in request
          error = 'Bad request: invalid action specified';
          break;
        case 8200:
          // Update failed in ES (no docs updated)
          error = 'Unable to update command. Please try again later.';
          break;
        default:
          error = 'Unable to update command. Please try again later.'
      }
    } else if (response && 'success_code' in response && response.success_code == 8000) {
      if ('command' in response && 'cmd_id' in response.command) {
        let updated_command: Command = response.command;
        let updated_cmd_id = updated_command.cmd_id
        this.selected_command = updated_command;
        this.insertUpdatedCommand(updated_command);
        this.comment_input = '';
      }
    } else {
      error = 'Unable to update command. Please try again later.'
    }

    if (action == 'comment') {
      this.comment_error = error;
      this.loading_comment = false;
    } else {
      this.delete_error = error;
      this.loading_delete = false;
    }

    this.draw();

    this.scrollComments();
  }

  scrollComments() {
    setTimeout(_ => {
      try {
        this.commentPusher.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' })
        this.draw();
      } catch(err) { }
    }, 150)
  }

  /**
   * Insert the given command into the list of commands
   * This overrides the command if it is already in the list (based on cmd_id)
   * @param updated_command
   */
  insertUpdatedCommand(updated_command: Command) {
    let override = false;
    updated_command.eta = this.humanReadableTimeDiff(updated_command.arrival_at - this.current_time);
    this.commands = this.commands.map(command => {
      if (updated_command.cmd_id == command.cmd_id) {
        override = true
        return updated_command
      }
      return command
    });
    if (!override) {
      // Unable to override command. append it instead
      console.log("Unable to override updated command. pushing instead");
      this.commands.push(updated_command);
    }
  }

  /**
   * === Timing Logic
   */

  syncMainTimer() {
    this.current_time = ((+ new Date()) / 1000);
    this.game_time = this.current_time + this.world_unix_offset;

    // Format game time
    let isostring = new Date(this.game_time * 1000).toISOString()
    this.game_time_string = isostring.substring(0, 10) + ' ' + isostring.substring(11, 19);

    // Refresh counter
    if (this.command_last_poll_local > 0) {
      let sec_until_refresh = this.command_poll_frequency - (this.current_time - this.command_last_poll_local)
      this.next_refresh = Math.max(Math.ceil(Math.min(sec_until_refresh, this.command_last_poll_local)), 0);
    }
  }

  updateTimer(do_draw = true) {
    /**
     * This function is called every second. It updates the countdown timers for each command.
     * Every 5 seconds, the in-memory timer is synchronized by calling syncMainTimer()
     */
    this.syncMainTimer();

    if (this.commands && this.commands.length > 0) {
      this.filterExpired();

      // Update command timers
      this.commands.map(command => {
        command.eta = this.humanReadableTimeDiff(command.arrival_at - this.current_time);

        if (command.cancelable == true) {
          let cancel_time = 600;
          if (command.type == 'attack_spy') {
            cancel_time = 300;
          }
          if (command.started_at + cancel_time <= this.current_time) {
            command.cancelable = false;
          }
        }
        return command;
      });
    }

    if (do_draw) {
      this.draw();
    }
  }

  humanReadableTimeDiff(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let ss = Math.floor(seconds % 60);
    return hours + ':' + (minutes<10?'0':'') + minutes + ':' + (ss<10?'0':'') + ss;
  }

  /**
   * Dialogs
   */

  showHelpDialog() {
    this.dialog.open(OpsHelpDialog, {autoFocus: false});
  }

  showContactDialog() {
    this.dialog.open(ContactDialog, {autoFocus: false, data: {custom_title: 'Feedback', context: 'cmd_feedback'}});
  }

  public openIntelDialog(town_id): void {
    if (town_id <= 0) {
      return
    }
    let dialogRef = this.dialog.open(OpsIntelDialog, {
      width: '70%',
      height: '80%',
      panelClass: ['tight-dialog-container'],
      autoFocus: false,
      data: {
        id: town_id,
        world: this.world,
        team: this.team
      }
    });
  }

  public openUsersDialog() {
    let dialogRef = this.dialog.open(IndexMembersDialog, {
      minWidth: '60%',
      // height: '90%'
      autoFocus: false,
      disableClose: false,
      data: {
        index: {
          key: this.team,
          name: this.team_name,
          world: this.world,
          share_link: this.share_link,
          role: ''
        }
      }
    });
  }

  /**
   * Other
   */

  @HostListener('document:click', [])
  onClick(): void {
    this.draw();
  }

  copyBB(id, type='town') {
    let bb = '';
    switch (type) {
      case 'town':
        bb = `[town]`+id+`[/town]`
        break;
      case 'player':
        bb = `[player]`+id+`[/player]`
        break;
      default:
        return;
    }
    this.copyToClipboard(bb);
  }

  copyURL() {
    this.copyToClipboard(window.location.href);
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {});
    this.softNotification(text+' copied to clipboard', '', 5000);
  }
}
