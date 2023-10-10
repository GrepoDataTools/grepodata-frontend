import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {IndexerService} from '../../indexer.service';
import {JwtService} from '../../../auth/services/jwt.service';
import {OpsHelpDialog} from '../help/help.component';
import {ContactDialog} from '../../../header/header.component';
import {MatDialog} from '@angular/material/dialog';
import {WorldService} from '../../../services/world.service';
import {Command, CommandView} from './command';
import {Globals} from '../../../globals';
import {Title} from '@angular/platform-browser';
import {OpsIntelDialog} from '../intel-dialog/intel-dialog.component';
import {LocalCacheService} from '../../../services/local-cache.service';
import * as jwt_decode from 'jwt-decode';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {IndexMembersDialog} from '../../../shared/dialogs/index-members/index-members.component';
import { environment } from '../../../../environments/environment';
import {MediaMatcher} from '@angular/cdk/layout';
import {BasicDialog} from '../../../shared/dialogs/basic/basic.component';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.scss', './commands-game.scss', './commands-mobile.scss', './commands-darkmode.scss'],
  providers: [IndexerService, WorldService, LocalCacheService]
})
export class CommandsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('commentPusher') private commentPusher: ElementRef;
  @ViewChild('viewNameInput') private viewNameInput: ElementRef;

  team
  world
  team_name
  is_admin = false;
  showOpSettings = false;
  dark_mode = true;
  show_menu = false;
  share_link = '';
  my_uid = 0;
  username = 'user';

  // Data
  towns: any = []
  players: any = []
  uploaders: any = []
  commands: Command[] = []
  total_units: any = {}
  spam_towns: any = []
  objectKeys = Object.keys;

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

  // Delete logic
  deleting = false;
  deletingSelectUser = false;
  deletingOperation = '';
  deletingUserOptions: any = [];
  deletingUserSelected = null;
  deletingUserSelectedName = null;

  // Selected command editing logic
  selected_command: Command = null;
  hidden_commands_present = false;
  comment_input = '';
  loading_delete = false;
  delete_error = '';
  loading_comment = false;
  comment_error = '';

  // Filters & order
  is_filtered = false;
  command_types = ['attack_land', 'support', 'attack_sea', 'attack_spy', 'farm_attack', 'abort', 'revolt', 'attack_takeover', 'breakthrough'];
  default_order = 'arrival_asc'
  filter_targets_text = '';
  targets_sort = 'movements_desc';
  typingTimer;
  debounceTime = 500;
  dropdownSettingsPlayers: IDropdownSettings = {};
  dropdownSettingsTowns: IDropdownSettings = {};
  dropdownSettingsUploaders: IDropdownSettings = {};

  // Tabs
  viewer_version = 'v6';
  views: CommandView[];
  active_view: CommandView;
  editting_view_name = false;

  // Timing logic
  current_time;  // This is a unix timestamp representing the current UTC time
  game_time;  // This is a timestamp representing the game server time
  game_time_string;  // This is a human readable time representing the game server time
  world_unix_offset = 0;  // This is given by backend: current_time + world_unix_offset = current grepolis server time
  timer_refresh_interval

  // Mobile styling
  private readonly _mediaQueryListener: () => void;
  mobileQuery: MediaQueryList;
  mobile_filters_opened = false;
  mobile_comments_opened = false;

  env = environment;
  constructor(
    public dialog: MatDialog,
    private globals: Globals,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private authService: JwtService,
    private media: MediaMatcher,
    private indexerService: IndexerService,
    private titleService: Title,
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 1400px)');
    this._mediaQueryListener = () => cdr.detectChanges();
    this.mobileQuery.addEventListener('change', () => this._mediaQueryListener());
  }

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
    clearInterval(this.command_loading_interval);
    clearInterval(this.timer_refresh_interval);
  }

  initialize(params) {
    this.team = params.team;
    this.team_name = params.team;
    this.world = params.world;
    this.loading = true;
    this.refreshing = false;
    this.sync_status = 'LOADING'
    this.syncMainTimer();

    // Init views
    this.initializeCommandViews();

    // Check if serialized view is in url
    // TODO: views should be shared via backend to avoid these large URLs...
    try {
      if ('serialized_view' in params) {
        let serialized = params.serialized_view;
        let imported_view = this.deserializeView(serialized);
        if (imported_view && 'uuid' in imported_view) {
          let exists = this.views.filter(view => view.uuid == imported_view.uuid);
          if (exists.length <= 0) {
            this.views.push(imported_view);
            this.toggleView(imported_view, false);
          } else {
            console.log('imported view already exists!');
          }
        }
      }
    } catch (e) {
      console.log("Unable to load serialized view", e);
    }

    this.draw();

    // Do the first command pull
    this.loadCommands();

    // Start polling for commands
    this.restartPollingCommands();

    // Get index info
    this.authService.accessToken().then(access_token => {
      this.indexerService.getIndex(access_token, this.team, true).subscribe(
        (response) => this.parseIndexResponse(response)
      );

      let payload = jwt_decode(access_token);
      if (payload && 'uid' in payload) {
        this.my_uid = payload.uid;
        this.username = payload.username;
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

  toggleOpSettings(state) {
    this.showOpSettings = state;
    this.draw();
  }

  softNotification(message, title = '', lifetime=5000) {
    this.globals.showSnackbar(
      `<h4>`+message+`</h4>`,
      'success', title, true,lifetime);
  }

  /**
   * Tabs & views
   */

  newView() {
    let new_view = this.getNewView();
    this.views.push(new_view);
    this.saveSettingsToCache(); // required to persist active view into views
    this.toggleView(new_view, true); // switch to the new view
    this.draw();
  }

  serializeActiveView() {
    let view = this.active_view;
    view.version = this.viewer_version;
    let serialized = JSON.stringify(view);
    serialized = btoa(serialized);
    return serialized
  }

  deserializeView(serialized) {
    try {
      let decoded: any = atob(serialized);
      decoded = JSON.parse(decoded);
      if (decoded && 'version' in decoded) {
        if (decoded.version == this.viewer_version) {
          console.log("parsed valid serialized view: ", decoded);
          return decoded
        } else {
          console.log("serialized view version mismatch");
        }
      }
    } catch (e) {
      console.log('Unable to deserialize view: ', e);
    }
    return false;
  }

  getNewView(): CommandView {
    let uuid = Date.now() + '_' + Math.floor(Math.random() * 10000) // close enough
    let view = new CommandView()
    view.uuid = uuid;
    view.is_default = false;
    view.active = false;
    view.tab_name = 'New View';
    view.name_changed = false;
    view.is_filtered = false;
    view.show_returns = true;
    view.showCancelTime = false;
    view.showDeletedCommands = false;
    view.hide_planned_commands = false;
    view.hide_spam_commands = 0;
    view.command_type_toggle = this.getTypeToggleDict();
    view.filter_order = this.default_order;
    view.filter_text = '';
    view.filter_town = [];
    view.filter_player = [];
    view.filter_uploader = [];
    view.filter_town_type = 'incl';
    view.filter_player_type = 'incl';
    view.filter_uploader_type = 'incl';
    return view
  }

  getTypeToggleDict() {
    let toggle_dict = {}
    this.command_types.forEach(x => {toggle_dict[x] = true });
    return toggle_dict;
  }

  toggleView(activate_view: CommandView, focus_name_input=false) {
    this.views.map(view => {view.active = false; return view}); // deactivate all views
    activate_view.active = true;
    this.active_view = activate_view; // activate selected view
    this.editting_view_name = focus_name_input;
    this.saveSettingsToCache();
    this.filterCommands(false, false);
    this.sortCommands(false);
    this.draw();

    if (focus_name_input) {
      setTimeout(_ => {
        this.editting_view_name = true;
        if (this.viewNameInput) {
          this.viewNameInput.nativeElement.select();
          this.draw();
        }
      }, 150);
    }
  }

  doEditViewName() {
    if (this.active_view.is_default) {
      return;
    }
    this.editting_view_name = true;
    this.draw();
    setTimeout(_ => {
      this.editting_view_name = true;
      if (this.viewNameInput) {
        this.viewNameInput.nativeElement.select();
        this.draw();
      }
    }, 50);
  }

  saveViewName() {
    this.editting_view_name = false;
    this.draw();
    this.saveSettingsToCache();
  }

  viewNameChange() {
    // Register changed name to prevent automated overrides
    this.active_view.name_changed = true;
  }

  deleteView(delete_view: CommandView, confirm = false) {
    if (confirm && window.confirm("Are you sure you want to delete view '"+delete_view.tab_name+"'?")!=true) {
      return
    }
    if (delete_view.is_default) {
      console.log("Unable to delete default view!");
      return
    }
    if (this.views.length <= 1) {
      console.log("Cannot delete last view");
      return
    }
    console.log(delete_view);
    this.views = this.views.filter(view => view.uuid != delete_view.uuid);
    this.toggleView(this.views[this.views.length-1], false); // Toggle back to previous view
    this.draw();
    this.saveSettingsToCache();
  }

  /**
   * === Data loading
   */

  restartPollingCommands() {
    // TODO: stop polling if browser tab is inactive!
    if (!this.command_poll_frequency || isNaN(this.command_poll_frequency) || this.command_poll_frequency < 5) {
      this.command_poll_frequency = 15;
    }
    console.log("changing poll frequency to", this.command_poll_frequency);
    clearInterval(this.command_loading_interval);
    this.command_loading_interval = setInterval(_ => {this.loadCommands()}, this.command_poll_frequency*1000);
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
    if (response && 'index_name' in response) {
      this.team_name = response.index_name;
      this.is_admin = response.is_admin;
      this.share_link = response.share_link??'';
      this.world_unix_offset = response.unix_offset;
    } else {
      this.team_name = this.team;
      this.is_admin = false;
      this.share_link = '';
      this.world_unix_offset = 0;
    }
    this.draw();
  }

  trackCommandByFn(index, command: Command) {
    return command.cmd_id + command.arrival_at;
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
      // stopPolling = true;
    } else if (response.status === 429) {
      // Rate limit exceeded. ignore.
      console.log('Rate limit exceeded');
      this.sync_status = 'Rate limited';
      this.command_poll_frequency = 15;
      this.restartPollingCommands();
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
        let updated_command_ids = updated_commands.map(c => {
          if (this.selected_command && c?.delete_status === 'hard' && this.selected_command?.cmd_id === c?.cmd_id) {
            this.selected_command = null;
          }
          return c.cmd_id
        });

        // Keep old commands
        let old_commands = this.commands.filter(command => {
          // If an updated_command has a hard delete status, this will also ensure that it is removed from the set of old_commands
          return updated_command_ids.indexOf(command.cmd_id) < 0;
        });

        // Remove hard deleted commands from the updated commands
        updated_commands = updated_commands.filter(command => {
          return command.delete_status != 'hard';
        });

        // Enforce hidden status (hidden can be undefined on new commands so we need to initialize it)
        updated_commands.map(command => {
          if (!command.hidden) {
            command.hidden = false;
          }
          return command;
        });

        // Merge the 2 command sets
        this.commands = [...updated_commands, ...old_commands];

        // Sort the commands
        this.sortCommands(false);

        // Update ETA
        this.updateTimer(false);

        // build command graph
        this.buildGraph(false);

        // reapply filter logic
        this.filterCommands(false, false);

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

      if (this.graph_requires_rebuild == true) {
        this.graph_requires_rebuild = false
        this.buildGraph(false);
      }
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
      that.doFilter('text');
    }, this.debounceTime);
  }

  targetMatchesFilter(target) {
    if (target.label.toLowerCase().includes(this.filter_targets_text.toLowerCase())) {
      return true;
    }
    if (target.ply_n.toLowerCase().includes(this.filter_targets_text.toLowerCase())) {
      return true;
    }
    if (target.all_n.toLowerCase().includes(this.filter_targets_text.toLowerCase())) {
      return true;
    }
    return false;
  }

  selectTarget(target) {
    // Set active view to default view
    this.toggleView(this.views[0])

    let is_selected = this.isSelectedTarget(target)

    // Reset all filters
    this.clearFilter('all', false)

    if (!is_selected) {
      this.active_view.filter_town = [{id: target.label, text: `${target.label} (${target.hits})`}]
    }
    this.doFilter(this.active_view.filter_town)

    // Draw updates
    this.draw()
  }

  isSelectedTarget(target) {
    return this.active_view.filter_town.some(town_filter => town_filter.id === target.label)
  }

  filterExpired() {
    let count_old = this.commands.length
    this.commands = this.commands.filter(command => {
      // Parse planned commands with elapsed departures
      let valid_departure = true
      if (command?.is_planned == true && command.started_at <= this.current_time) {
        valid_departure = false;
      }

      // Parse elapsed arrival times
      let valid_arrival = true
      if (command.arrival_at <= this.current_time) {
        valid_arrival = false;
      }

      return valid_departure && valid_arrival;
    });
    let has_expired_commands = this.commands.length != count_old
    if (has_expired_commands) {
      // Rebuild target graph if commands have expired
      this.graph_requires_rebuild = true
    }
  }

  doSort() {
    if (this.loading) {
      return;
    }
    this.sortCommands();
    setTimeout(_ => {this.saveSettingsToCache()}, 100);
  }

  doFilter(filter_selection=null) {
    if (this.loading) {
      return;
    }
    if (!this.active_view.name_changed && this.active_view.tab_name == 'New View') {
      if (filter_selection && Array.isArray(filter_selection) && filter_selection.length > 0 && 'id' in filter_selection[0]) {
        // Automatically select the first name
        this.active_view.tab_name = filter_selection[0].id
        this.active_view.name_changed = true;
        this.editting_view_name = false;
      }
    }
    this.filterCommands();
    setTimeout(_ => {this.saveSettingsToCache()}, 100);
  }

  doChangeFrequency() {
    if (this.loading) {
      return;
    }
    this.restartPollingCommands();
  }

  doSettings() {
    this.draw();
    setTimeout(_ => {this.saveSettingsToCache()}, 100);
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

    this.players = Object.keys(player_bins).filter(n => n != '').map(player => { return {text: player + " (" + player_bins[player] + ")", id: player, count: player_bins[player]}});
    this.towns = Object.keys(town_bins).filter(n => n != '').map(town => { return {text: town + " (" + town_bins[town] + ")", id: town, count: town_bins[town]}});
    this.uploaders = Object.keys(uploader_bins).map(uploader => { return {text: uploader + " (" + uploader_bins[uploader] + ")", id: uploader, count: uploader_bins[uploader]}});

    this.sortMultiselectFilterOptions(this.players);
    this.sortMultiselectFilterOptions(this.towns);
    this.sortMultiselectFilterOptions(this.uploaders);
  }

  sortMultiselectFilterOptions(options) {
    options.sort((c1, c2) => {
      return c1.text < c2.text ? -1 : 1;
      // if (c1.count == c2.count) {
      //   return c1.text < c2.text ? -1 : 1
      // } else {
      //   return c1.count > c2.count ? -1 : 1
      // }
    });
  }

  clearFilter(key='all', do_draw = true) {
    switch (key) {
      case 'text':
        this.active_view.filter_text = '';
        break;
      case 'town':
        this.active_view.filter_town = [];
        this.active_view.filter_town_type = 'incl';
        break;
      case 'player':
        this.active_view.filter_player = [];
        this.active_view.filter_player_type = 'incl';
        break;
      case 'uploader':
        this.active_view.filter_uploader = [];
        this.active_view.filter_uploader_type = 'incl';
        break;
      case 'all':
      default:
        this.active_view.filter_text = '';
        this.active_view.filter_town = [];
        this.active_view.filter_player = [];
        this.active_view.filter_uploader = [];
        this.active_view.filter_town_type = 'incl';
        this.active_view.filter_player_type = 'incl';
        this.active_view.filter_uploader_type = 'incl';
    }
    this.active_view.show_returns = true;
    this.active_view.hide_planned_commands = false;
    this.active_view.command_type_toggle = this.getTypeToggleDict();

    this.filterCommands(do_draw, false);

    if (do_draw) {
      this.draw();
    }

    this.saveSettingsToCache();
  }

  isFiltered() {
    if (
      this.active_view.filter_text != ''
      || this.active_view.show_returns == false
      || this.active_view.hide_planned_commands == true
      || this.active_view.filter_town.length > 0
      || this.active_view.filter_player.length > 0
      || this.active_view.filter_uploader.length > 0
      || Object.values(this.active_view.command_type_toggle).reduce((a: any, b: any) => a + b, 0) != this.command_types.length
    ) {
      return true
    }
    return false;
  }

  sortCommands(do_draw = true) {
    this.commands.sort((c1, c2) => {
      // command time defaults to arrival_at, but ongoing revolts need to be phased correctly
      let command1_time = c1.subtype == 'ongoing_revolt' && c1.started_at > this.current_time ? c1.started_at : c1.arrival_at;
      let command2_time = c2.subtype == 'ongoing_revolt' && c2.started_at > this.current_time ? c2.started_at : c2.arrival_at;

      let sort = 0;
      if (command1_time == command2_time) {
        // If arrival is in the same second, the command that departed first will arrive earlier
        if (c1.started_at == c2.started_at || c1.started_at <= 0 || c2.started_at <= 0) {
          // If both commands departed at the same time, the lower command id will arrive earlier
          sort = c1.cmd_id < c2.cmd_id ? -1 : 1
        } else {
          // earlier departure means earlier arrival
          sort = c1.started_at < c2.started_at ? -1 : 1
        }
      } else {
        sort = command1_time < command2_time ? -1 : 1
      }

      if (this.active_view.filter_order == 'arrival_desc') {
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

  toggleShowReturns() {
    this.active_view.show_returns = !this.active_view.show_returns;
    this.filterCommands();
    setTimeout(_ => this.saveSettingsToCache(), 300);
    this.draw();
  }

  toggleCommandTypeFilter(command_type) {
    this.active_view.command_type_toggle[command_type] = !this.active_view.command_type_toggle[command_type];
    this.filterCommands();
    setTimeout(_ => this.saveSettingsToCache(), 300);
    this.draw();
  }

  filterCommands(do_draw = true, do_save_settings = true) {
    this.is_filtered = this.isFiltered();
    let has_hidden_commands = false;
    if (this.is_filtered || !this.active_view.showDeletedCommands || this.active_view.hide_spam_commands>0) {
      // console.log('applying filters');

      let spam_town_ids = [];
      if (this.active_view.hide_spam_commands > 0) {
        // Get a list of all town ids that exceed the outgoing spam threshold
        console.log(this.graph_nodes);
        let spam_towns = this.graph_nodes.filter(town => town.outgoing >= this.active_view.hide_spam_commands && town.id > 0)
        spam_town_ids = spam_towns.map(town => town.id)
        this.spam_towns = spam_towns.map(town => town.label)
        console.log('spam towns: ', spam_town_ids)
      }

      this.commands.map(command => {
        let hidden = false;

        if (this.active_view.show_returns != true && command.return == true) {
          hidden = true;
        }
        if ('is_planned' in command && command.is_planned == true) {
          if (this.active_view.hide_planned_commands == true) {
            hidden = true;
          }
        }
        if (command.delete_status != '') {
          has_hidden_commands = true;
          if (!hidden && !this.active_view.showDeletedCommands) {
            hidden = true;
          }
        }
        if (!hidden && this.command_types.indexOf(command.type) >= 0 && this.active_view.command_type_toggle[command.type] === false) {
          hidden = true;
        } else if (!hidden && command.type == 'attack' && this.active_view.command_type_toggle['attack_land'] === false) {
          hidden = true;
        } else if (!hidden && command.type == 'portal_attack_olympus' && this.active_view.command_type_toggle['attack_land'] === false) {
          hidden = true;
        } else if (!hidden && command.type == 'portal_support_olympus' && this.active_view.command_type_toggle['support'] === false) {
          hidden = true;
        } else if (!hidden && command.type == 'foundation' && this.active_view.command_type_toggle['attack_takeover'] === false) {
          hidden = true;
        }

        if (!hidden && this.active_view.filter_player.length > 0) {
          let player_names = this.active_view.filter_player.map(filter => filter.id)

          if (this.active_view.filter_player_type == 'incl') {
            // Inclusive
            if (player_names.indexOf(command.trg_ply_n) < 0 && player_names.indexOf(command.src_ply_n) < 0) {
              hidden = true;
            }
          } else {
            // Exclusive
            if (player_names.indexOf(command.trg_ply_n) >= 0 || player_names.indexOf(command.src_ply_n) >= 0) {
              hidden = true;
            }
          }
        }

        if (!hidden && this.active_view.filter_town.length > 0) {
          let town_names = this.active_view.filter_town.map(filter => filter.id)
          if (this.active_view.filter_town_type == 'incl') {
            // Inclusive
            if (town_names.indexOf(command.trg_twn_n) < 0 && town_names.indexOf(command.src_twn_n) < 0) {
              hidden = true;
            }
          } else {
            // Exclusive
            if (town_names.indexOf(command.trg_twn_n) >= 0 || town_names.indexOf(command.src_twn_n) >= 0) {
              hidden = true;
            }
          }
        }

        if (!hidden && this.active_view.filter_uploader.length > 0) {
          let uploader_names = this.active_view.filter_uploader.map(filter => filter.id)

          if (this.active_view.filter_uploader_type == 'incl') {
            // Inclusive
            if (uploader_names.indexOf(command.upload_n) < 0) {
              hidden = true;
            }
          } else {
            // Exclusive
            if (uploader_names.indexOf(command.upload_n) >= 0) {
              hidden = true;
            }
          }
        }

        if (!hidden && this.active_view.filter_text != '') {
          let search_domain = command.src_ply_n + command.src_twn_n + command.trg_ply_n + command.trg_twn_n + command.subtype
          // Add comments to search domain
          if ('comments' in command) {
            search_domain += command.comments.map(comment => comment.text).join()
          }
          if (!search_domain.toLowerCase().includes(this.active_view.filter_text.toLowerCase())) {
            hidden = true;
          }
        }
        if (!hidden && this.active_view.hide_spam_commands > 0) {
          if (spam_town_ids.indexOf(command.src_twn_id) >= 0) {
            hidden = true;
          }
        }

        command.hidden = hidden;
        return command;
      });

    } else {
      this.commands.map(command => {
        command.hidden = false;
        if (command.delete_status != '') {
          has_hidden_commands = true;
        }
        return command;
      });
    }
    this.hidden_commands_present = has_hidden_commands;
    console.log('has hidden',this.hidden_commands_present);

    // Sum total units
    let total_units = {};
    this.commands.forEach(command => Object.keys(command.units).forEach(unit => {
      if (command.hidden || command.delete_status != '') {
        return
      }
      if (unit in total_units) {
        total_units[unit] += command.units[unit]
      } else {
        total_units[unit] = command.units[unit]
      }
    }));
    this.total_units = total_units;

    if (do_draw) {
      this.draw();
    }

    if (do_save_settings) {
      this.saveSettingsToCache();
    }
  }

  /**
   * === Local caching logic
   */

  saveSettingsToCache() {
    // override active_view into views
    this.views.map(view => {
      if (view.uuid == this.active_view.uuid) {
        return this.active_view
      }
      return view;
    });
    let cache_entry = {
      version: this.viewer_version,
      views: this.views,
      dark_mode: this.dark_mode
    }
    console.log('saving views to cache: ', cache_entry);
    LocalCacheService.set('cmd_views_'+this.team, cache_entry);
  }

  initializeCommandViews() {
    let cached_views = LocalCacheService.get('cmd_views_'+this.team, true);
    console.log('Cached views: ', cached_views);
    let clean_view = true;
    if (cached_views && 'version' in cached_views && 'views' in cached_views && cached_views.views.length > 0) {
      if (cached_views.version != this.viewer_version) {
        console.log("cached views version mismatch: ", cached_views.version, " != ", this.viewer_version);
      } else {
        console.log("Initializing views from cache");
        this.views = cached_views.views;
        let is_active = false;
        this.views.forEach(view => {
          if (view.active) {
            is_active = true;
            console.log("Found active view in cache");
            this.active_view = view;
          }
        });
        if (!is_active) {
          console.log("Forcing active view 0");
          this.active_view = this.views[0]
        }
        if (this.active_view && 'uuid' in this.active_view) {
          clean_view = false;
        }

        if ('dark_mode' in cached_views) {
          this.dark_mode = cached_views.dark_mode
        }
      }
    }

    if (clean_view) {
      console.log("Creating new default view");
      // Create new default view
      let default_view = this.getNewView();
      default_view.tab_name = 'Default'; //🔒
      default_view.active = true;
      default_view.is_default = true;
      this.views = [default_view];
      this.active_view = default_view;
    }
  }

  /**
   * === Command update Logic
   */

  selectCommand(command: Command) {
    if (this.selected_command && 'cmd_id' in this.selected_command && command.cmd_id == this.selected_command.cmd_id) {
      // unselect!
      this.unselectCommand()
    } else {
      this.mobile_comments_opened = true;
      this.selected_command = command;
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

  unselectCommand() {
    this.mobile_comments_opened = false;
    this.selected_command = null;
  }

  deleteCommand(es_id, new_delete_status) {
    if (this.loading_delete) {
      return;
    }
    this.loading_delete = true;
    if (new_delete_status == 'soft') {
      this.hidden_commands_present = true;
    }
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
        case 8110:
          // Invalid action in request
          error = 'Bad request: invalid action specified';
          break;
        case 8120:
          // User is not an admin
          error = 'Unauthorized: you need to be a team admin to perform this action.';
          if (action == 'delete') {
            error = 'Unauthorized: you need to be an admin to delete commands of other players.';
          }
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
    // this.game_time_string = isostring.substring(0, 10) + ' ' + isostring.substring(11, 19);
    this.game_time_string = isostring.substring(11, 19);

    // Refresh counter
    if (this.command_last_poll_local > 0) {
      let sec_until_refresh = this.command_poll_frequency - (this.current_time - this.command_last_poll_local)
      this.next_refresh = Math.max(Math.ceil(Math.min(sec_until_refresh, this.command_last_poll_local)), 0);
    }
  }

  updateTimer(do_draw = true) {
    /**
     * This function is called every second. It updates the countdown timers for each command.
     */
    this.syncMainTimer();

    let do_sort = false;
    if (this.commands && this.commands.length > 0) {
      this.filterExpired();

      // Update target timers
      this.targets.map(target => {
        target.eta = this.humanReadableTimeDiff(target.avg_arrival - this.current_time);
      })

      // Update command timers
      this.commands.map(command => {
        let countdown_time = command.arrival_at; // Default: countdown to arrival

        // Parse revolt phasing
        if (command.subtype == 'ongoing_revolt') {
          if (command.started_at > this.current_time) {
            command.attacking_strategy = 'revolt_arising'
            countdown_time = command.started_at; // arising revolts should countdown to phase 2 start
          } else {
            if (command.attacking_strategy != 'revolt_running') {
              do_sort = true; // revolt status has changed, resort needed
            }
            command.attacking_strategy = 'revolt_running'
          }
        }

        // Parse cancel time
        if (command.cancelable == true) {
          let cancel_time = 600;
          if (command.type == 'attack_spy') {
            cancel_time = 300;
          }
          if (command.started_at + cancel_time <= this.current_time) {
            command.cancelable = false;
          }
        }

        // Update ETA countdown timer
        command.eta = this.humanReadableTimeDiff(countdown_time - this.current_time);

        return command;
      });
    }

    if (do_sort) {
      this.sortCommands(do_draw);
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
   * Graph logic
   */

  graph_links = []
  graph_nodes = []
  targets = []
  zoomToFit$: Subject<boolean> = new Subject();
  graph_requires_rebuild = false;

  buildGraph(do_draw=false) {
    let nodes : any = {}
    let links = []
    let i=0
    this.commands.forEach(command => {
      // if (['revolt'].includes(command.type)) {
      //   return
      // }

      i += 1

      // Add a new link between source and target
      links.push({
        id: i,
        source: command.src_twn_id,
        target: command.trg_twn_id,
        type: command.type
      })

      // Create source town node if it does not exist
      if (!(command.src_twn_id in nodes)) {
        nodes[command.src_twn_id] = {
          id: Number(command.src_twn_id),
          hits: 0,
          outgoing: 0,
          size: 12,
          label: command.src_twn_n,
          ply_id: command.src_ply_id,
          ply_n: command.src_ply_n,
          all_id: command.src_all_id,
          all_n: command.src_all_n,
          arrivals: []
        }
      }

      // Create target town node if it does not exist
      if (!(command.trg_twn_id in nodes)) {
        nodes[command.trg_twn_id] = {
          id: Number(command.trg_twn_id),
          hits: 0,
          outgoing: 0,
          size: 12,
          label: command.trg_twn_n,
          ply_id: command.trg_ply_id,
          ply_n: command.trg_ply_n,
          all_id: command.trg_all_id,
          all_n: command.trg_all_n,
          arrivals: []
        }
      }

      // Increment counters
      nodes[command.src_twn_id].outgoing += 1
      nodes[command.trg_twn_id].hits += 1
      nodes[command.trg_twn_id].arrivals.push(command.arrival_at)
    });

    const median = arr => (arr.sort((a, b) => a - b)[Math.floor(arr.length / 2)] + arr[Math.ceil(arr.length / 2)]) / 2;

    // Aggregate targets: perform aggregated calculation to determine targeted towns
    let nodes_actual: any = Object.values(nodes)
    let targets = nodes_actual.filter(node => node.hits > 0);
    targets = targets.map(item => {
      item.size = 12 + Math.round(1 * Math.exp(0.1 * item.hits))
      if (item.arrivals.length > 0) {
        let sum = item.arrivals.reduce((a: number, b: number): number => a + b)
        item.min_arrival = Math.min(item.arrivals)
        item.max_arrival =  Math.max(item.arrivals)
        item.avg_arrival = sum / item.arrivals.length
        item.eta = this.humanReadableTimeDiff(item.avg_arrival - this.current_time)
      }
      return item
    })

    // Persist data updates
    this.graph_links = links;
    this.graph_nodes = nodes_actual;
    this.targets = targets;
    setTimeout((_) => this.zoomToFit$.next(true), 1000)

    this.sort_targets()

    // console.log('links', this.graph_links);
    // console.log('nodes', this.graph_nodes);
    // console.log('targets', this.targets);
  }

  sort_targets(draw=false) {
    this.targets.sort((t1, t2) => {
      if (t1.hits == t2.hits || this.targets_sort === 'arrival_asc') {
        return t1.avg_arrival > t2.avg_arrival ? 1 : -1
      } else {
        // default: incoming movements DESC
        return t1.hits < t2.hits ? 1 : -1
      }
    });
    if (draw) {
      this.draw()
    }
  }

  select_node(node) {
    console.log(node);
    this.active_view.filter_town = [{id: node.label, text: `${node.label} (${node.hits})`}]
    this.doFilter(this.active_view.filter_town)
    this.draw()
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
   * Command deleting & updates
   */

  deleteOnBehalfOf(operation) {
    this.deletingSelectUser = true;
    this.deletingOperation = operation;
    let active_users = {}
    this.commands.forEach(command => active_users[command.upload_uid] = {name: command.upload_n, uid: command.upload_uid});
    this.deletingUserOptions = active_users;
    this.draw();
  }

  deleteOnBehalfOfSubmit() {
    this.deletingSelectUser = false;
    this.deleteOperation(this.deletingOperation, 'admin');
  }

  cancelDeleteOnBehalfOf() {
    this.deletingSelectUser = false;
    this.deletingOperation = null;
    this.deletingUserOptions = [];
    this.draw();
  }

  deleteOperation(operation, verification_level) {
    if (operation === 'delete_all_team') {
      // show confirm dialog for delete all action
      const dialogRef = this.dialog.open(BasicDialog, {
        // minWidth: '40%',
        autoFocus: false,
        data: {
          title: '',
          show_close: false,
          messageHtml: '<div class="text-center"><h3>Are you sure you want to delete all active commands in this operation?</h3><h5 style="color: red !important; font-weight: 900 !important;">The operation will be ended. This can not be undone!</h5></div>',
          cancel_action: 'Cancel',
          action_type: 'danger',
          action: 'Delete All Commands',
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);

        if (result === true) {
          this.authService.accessToken().then(access_token => {
            this.indexerService.updateCommandsByQuery(access_token, this.team, this.world, operation, 'na').subscribe(
              (response) => this.parseDeleteOperationResponse(response),
              (error) => this.parseDeleteOperationResponse(error)
            );
          });
        }

      });
      return;
    }

    let update_content = '';
    if (verification_level == 'user') {
      update_content = 'authenticated_user'
    } else {
      update_content = this.deletingUserSelected;
    }

    this.deleting = true;
    this.draw();

    this.authService.accessToken().then(access_token => {
      this.indexerService.updateCommandsByQuery(access_token, this.team, this.world, operation, update_content).subscribe(
        (response) => this.parseDeleteOperationResponse(response),
        (error) => this.parseDeleteOperationResponse(error)
      );
    });
  }

  parseDeleteOperationResponse(response) {
    console.log('command batch update response: ', response);
    let error = '';
    if (response && 'error_code' in response) {
      switch (response.error_code) {
        case 7504:
          // User does not have read access on this team
          error = 'Unauthorized: you do not have access to this team.';
          break;
        case 8110:
          // Invalid action in request
          error = 'Bad request: invalid action specified';
          break;
        case 8120:
          // User is not an admin
          error = 'Unauthorized: you need to be a team admin to perform this action.';
          break;
        case 8210:
          // No commands updated; this can be a nominal failure mode (e.g. all commands already expired)
          // error = 'Unable to update commands. Please try again later.';
          error = '';
          break;
        case 8220:
          // Bad request content
          error = 'Bad request: invalid action content';
          break;
        default:
          error = 'Unable to update commands. Please try again later. Or contact us if this error persists'
      }
    } else if (response && 'success_code' in response && response.success_code == 8000) {
      error = ''
    } else {
      error = 'Unable to update commands. Please try again later. Or contact us if this error persists'
    }
    this.deleting = false;

    if (error!='') {
      alert(error);
    } else {
      this.showOpSettings = false;
      this.softNotification("Your request was processed successfully.", "Request Completed Successfully", 15000);
      setTimeout(_ => {
        this.loadCommands();
        this.draw();
      }, 1000)
    }

    this.draw();
  }

  /**
   * Other
   */

  toggleFilterTab(show) {
    this.mobile_filters_opened = show;
    this.draw();
  }

  toggleCommentsTab(show) {
    this.mobile_comments_opened = show;
    this.unselectCommand();
    this.draw();
  }

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

  copyURL(include_filter_settings = false) {
    let url = this.env.url + '/operations/' + this.team + '/' + this.world;

    // Try to serialize view
    if (include_filter_settings) {
      let serialized = this.serializeActiveView();
      if (serialized.length > 1800) {
        console.error("Unable to share view via url");
      } else {
        url += '/' + serialized
      }
      console.log(this.deserializeView(serialized));
    }

    this.copyToClipboard(url, 'Sharing link copied to clipboard!');
  }

  copyToClipboard(text, snackbar_msg='') {
    if (snackbar_msg=='') {
      snackbar_msg = text+' copied to clipboard';
    }
    navigator.clipboard.writeText(text).then(() => {});
    this.softNotification(snackbar_msg, '', 5000);
  }
}


/**
 * TODO:
 * - hide spam commands
 * - toggle filters inclusive/exclusive
 * - target list
 * - map view
 * - right click context menu
 * - comments
 *
 */
