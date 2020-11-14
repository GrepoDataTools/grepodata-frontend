import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConquestService } from './conquest.service';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-conquest',
    templateUrl: './conquest.component.html',
    styleUrls: ['./conquest.component.scss'],
    providers: [ConquestService],
})
export class ConquestComponent implements AfterViewInit, OnChanges {
    @ViewChild('conqdate', { static: false, read: ElementRef }) filterDate: ElementRef;
    @ViewChild('conqcity', { static: false, read: ElementRef }) filterCity: ElementRef;
    @ViewChild('conqoname', { static: false, read: ElementRef }) filterOldName: ElementRef;
    @ViewChild('conqnname', { static: false, read: ElementRef }) filterNewName: ElementRef;

    @Input() embedded: boolean;
    @Input() minimal: boolean;
    @Input() params: any;

    public mobile: boolean = true;

    loading = false;
    filtering = false;
    loadingFiltered = false;
    noData = true;
    name = '';
    type = '';
    world = '';
    id = '';
    data = [];
    from = 0;
    size = 30;
    count = 0;
    pageEvent: PageEvent;

    toggleFriendly = true;
    toggleInternal = true;
    toggleEnemy = true;

    // Debounce
    typingTimer;
    debounceTime = 500;
    usedInput: any;

    math: any;
    constructor(
        public conquestService: ConquestService,
        public router: Router,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute
    ) {
        if (window.screen.width > 560) {
            // 768px portrait
            this.mobile = false;
        } else {
            this.size = 10;
            this.debounceTime = 1500;
        }
        this.math = Math;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.embedded = true;
        this.params = changes.params.currentValue;
        this.resetToggles();
        this.clearFilters();
        this.filtering = false;
        this.from = 0;
        this.size = this.mobile || this.minimal ? 10 : 30;
        this.cdr.detectChanges();
        setTimeout((_) => this.cdr.detectChanges(), 250);
        this.load(this.params);
    }

    ngAfterViewInit(): void {
        this.cdr.detach();
        this.cdr.detectChanges();
        setTimeout((_) => this.cdr.detectChanges(), 250);

        // Embedded loading
        // if (this.embedded === true) {
        // 	this.load(this.params);
        // } else {
        // 	this.embedded = false;
        // }

        // Routed loading
        this.route.queryParams.subscribe((params) => {
            if (params.world != undefined && params.id != undefined) {
                if (this.route.routeConfig.path.search('conquest') >= 0) {
                    this.cdr.detectChanges();
                    this.router.navigate(['/conquest/player/' + params.world + '/' + params.id]);
                }
            }
        });
        this.route.params.subscribe((params) => {
            if (this.route.routeConfig && this.route.routeConfig.path.search('conquest/') >= 0) {
                this.embedded = false;
                this.usedInput = null;
                this.cdr.detectChanges();
                // this.clearFilter();
                this.load(params);
            }
        });
    }

    linkScrollTop() {
        window.scrollTo(0, 0);
    }

    resetToggles() {
        this.toggleFriendly = true;
        this.toggleInternal = true;
        this.toggleEnemy = true;
        this.cdr.detectChanges();
    }

    clearFilters() {
        if (this.filterDate) this.filterDate.nativeElement.value = '';
        if (this.filterCity) this.filterCity.nativeElement.value = '';
        if (this.filterOldName) this.filterOldName.nativeElement.value = '';
        if (this.filterNewName) this.filterNewName.nativeElement.value = '';
        this.cdr.detectChanges();
        setTimeout((_) => this.cdr.detectChanges(), 250);
    }

    filterKeyup($event) {
        if (typeof $event != 'undefined') {
            this.usedInput = $event.target;
        }

        if (typeof $event == 'undefined' || $event.target.value.length > 1 || $event.target.value == '') {
            clearTimeout(this.typingTimer);
            let that = this;
            this.typingTimer = setTimeout(function () {
                that.filterEvent();
            }, this.debounceTime);
        }
    }

    paginatorEvent($event) {
        this.pageEvent = $event;
        if (typeof this.pageEvent != 'undefined') {
            this.from = this.pageEvent.pageIndex * this.pageEvent.pageSize;
            this.size = this.pageEvent.pageSize;
            this.load({
                type: this.type,
                world: this.world,
                id: this.id,
            });
            this.cdr.detectChanges();
            setTimeout((_) => this.cdr.detectChanges(), 250);
        }
    }

    filterEvent() {
        this.from = 0;
        this.size = 10;
        this.filtering = true;
        this.loadingFiltered = true;
        this.load({
            type: this.type,
            world: this.world,
            id: this.id,
        });
        this.cdr.detectChanges();
        setTimeout((_) => this.cdr.detectChanges(), 250);
    }

    filterClearInput() {
        this.clearFilters();
        this.filtering = false;
        this.usedInput = null;
        this.from = 0;
        this.size = this.minimal || this.mobile ? 10 : 30;
        this.load({
            type: this.type,
            world: this.world,
            id: this.id,
        });
        this.cdr.detectChanges();
        setTimeout((_) => this.cdr.detectChanges(), 250);
    }

    toggleEvent(size = this.size) {
        this.clearFilters();
        this.filtering = false;
        this.usedInput = null;
        this.from = 0;
        this.size = size;
        if (this.mobile || this.minimal) {
            this.size = 10;
        }
        this.load({
            type: this.type,
            world: this.world,
            id: this.id,
        });
        this.cdr.detectChanges();
        setTimeout((_) => this.cdr.detectChanges(), 250);
    }

    private load(params) {
        // Reset
        this.loading = true;

        // Save params
        this.type = params['type'];
        this.world = params['world'];
        this.id = params['id'];
        this.cdr.detectChanges();

        // Filters
        let filters = {
            tfriendly: this.toggleFriendly || false,
            tinternal: this.toggleInternal || false,
            tenemy: this.toggleEnemy || false,
            date: this.filterDate ? this.filterDate.nativeElement.value : '',
            city: this.filterCity ? this.filterCity.nativeElement.value : '',
            old_owner: this.filterOldName ? this.filterOldName.nativeElement.value : '',
            new_owner: this.filterNewName ? this.filterNewName.nativeElement.value : '',
        };

        if ('date' in params) {
            filters['date'] = params['date'];
            this.filtering = true;
        }

        this.conquestService.getConquests(this.type, this.world, this.id, this.from, this.size, filters).subscribe(
            (response) => this.renderConquests(response, filters),
            (error) => this.renderConquests(null, filters)
        );
        this.cdr.detectChanges();
        setTimeout((_) => this.cdr.detectChanges(), 250);
    }

    renderConquests(data, filters) {
        if (data == null || data.count == null || data.count <= 0) {
            this.noData = true;
            this.count = 0;
            this.data = [];
        } else {
            if (this.count != data.count) this.count = data.count;
            this.noData = false;
            this.data = data.conq;
            if (this.type == 'town') this.name = this.data[0].town_name;
            else {
                for (let i of this.data) {
                    if (this.name == '') {
                        if (this.type == 'player') {
                            if (i.o_p_id == this.id) this.name = i.o_p_name;
                            if (i.n_p_id == this.id) this.name = i.n_p_name;
                        } else {
                            if (i.o_a_id == this.id) this.name = i.o_a_name;
                            if (i.n_a_id == this.id) this.name = i.n_a_name;
                        }
                    }
                }
            }
        }
        this.loading = false;
        this.loadingFiltered = false;
        this.cdr.detectChanges();
        setTimeout((_) => this.cdr.detectChanges(), 250);
        setTimeout((_) => {
            if (this.filterDate && 'date' in filters) {
                this.filtering = true;
                this.filterDate.nativeElement.value = filters['date'];
            }
            this.cdr.detectChanges();
        }, 100);
        if (this.usedInput) {
            setTimeout(() => this.usedInput.focus(), 10);
        }
    }
}
