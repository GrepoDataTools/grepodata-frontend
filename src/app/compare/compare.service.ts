import { Component, Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalCacheService } from '../services/local-cache.service';

const COMPARE_TOAST = [
    '!min-w-0',
    '!max-w-[calc(100vw-32px)]',
    '!rounded-lg',
    '!border-0',
    '!bg-navy-800',
    '!py-2.5',
    '!pl-4',
    '!pr-2.5',
    '!text-white',
    '!shadow-xl',
    '!ring-1',
    '!ring-slate-900/5',
    '[&_.mat-simple-snackbar>span]:flex',
    '[&_.mat-simple-snackbar>span]:items-center',
    '[&_.mat-simple-snackbar>span]:gap-3',
    '[&_.mat-simple-snackbar>span]:!text-sm',
    '[&_.mat-simple-snackbar>span]:!font-medium',
    '[&_.mat-simple-snackbar>span]:!leading-5',
    "[&_.mat-simple-snackbar>span]:before:content-['']",
    '[&_.mat-simple-snackbar>span]:before:size-5',
    '[&_.mat-simple-snackbar>span]:before:flex-none',
    '[&_.mat-simple-snackbar>span]:before:bg-brand-500',
    '[&_.mat-simple-snackbar>span]:before:[mask:url(/assets/heroicons/24/outline/check-circle.svg)_center/contain_no-repeat]',
    '[&_.mat-simple-snackbar-action]:!my-0',
    '[&_.mat-simple-snackbar-action]:!ml-3',
    '[&_.mat-simple-snackbar-action]:!mr-0',
    '[&_.mat-simple-snackbar-action_button]:!rounded-md',
    '[&_.mat-simple-snackbar-action_button]:!bg-white/[.06]',
    '[&_.mat-simple-snackbar-action_button]:!px-2.5',
    '[&_.mat-simple-snackbar-action_button]:!py-1.5',
    '[&_.mat-simple-snackbar-action_button]:!text-sm',
    '[&_.mat-simple-snackbar-action_button]:!font-semibold',
    '[&_.mat-simple-snackbar-action_button]:!leading-5',
    '[&_.mat-simple-snackbar-action_button]:!text-brand-500',
    '[&_.mat-button-wrapper]:flex',
    '[&_.mat-button-wrapper]:items-center',
    '[&_.mat-button-wrapper]:gap-1',
    "[&_.mat-button-wrapper]:after:content-['']",
    '[&_.mat-button-wrapper]:after:size-4',
    '[&_.mat-button-wrapper]:after:flex-none',
    '[&_.mat-button-wrapper]:after:bg-current',
    '[&_.mat-button-wrapper]:after:[mask:url(/assets/heroicons/24/outline/arrow-right.svg)_center/contain_no-repeat]',
];

@Injectable()
export class CompareService {
    // cache vars
    private comparedPlayers: any;
    private comparedAlliances: any;

    public update$: any = new Subject();
    public doComparePlayer$: any = new Subject();
    public doCompareAlliance$: any = new Subject();
    public doHideSearch$: any = new Subject();
    public doSearchPlayerWorlds$: any = new Subject();

    constructor(
        public snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute,
        public cache: LocalCacheService
    ) {
        let cachedPlayers = this.getFromCache('player');
        if (cachedPlayers === false) {
            this.comparedPlayers = {};
        } else {
            this.comparedPlayers = cachedPlayers;
        }

        let cachedAlliances = this.getFromCache('alliance');
        if (cachedAlliances === false) {
            this.comparedAlliances = {};
        } else {
            this.comparedAlliances = cachedAlliances;
        }
    }

    searchOtherWorlds(name: string, id: string, server: string) {
        this.doSearchPlayerWorlds$.next([name, id, server]);
    }

    getAllPlayers() {
        return this.comparedPlayers;
    }

    getAllAlliances() {
        return this.comparedAlliances;
    }

    getComparedPlayers(world) {
        if (this.comparedPlayers[world] !== undefined) return this.comparedPlayers[world];

        return [];
    }

    getComparedAlliances(world) {
        if (this.comparedAlliances[world] !== undefined) return this.comparedAlliances[world];

        return [];
    }

    addPlayer(id, name, world) {
        id = id.toString();
        this.removePlayer(id, world);
        if (this.comparedPlayers[world] !== undefined) {
            this.comparedPlayers[world].push({
                id: id,
                name: name,
            });
        } else {
            this.comparedPlayers[world] = [];
            this.comparedPlayers[world].push({
                id: id,
                name: name,
            });
        }
        this.update$.next();

        // this.snackBar.openFromComponent(CompareSnackbar, {data: 'Player added!', duration: 3000, panelClass: ['success-snack']});

        let snackBarRef = this.snackBar.open('Player added to the comparison', 'Show comparison', {
            duration: 6000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: COMPARE_TOAST,
        });
        snackBarRef.onAction().subscribe((response) => {
            // if (this.router.url.indexOf('/compare') != -1) {
            this.router.navigate(['/compare/player/' + world]);
            this.doHideSearch$.next();
            // } else {
            //   this.doComparePlayer$.next();
            // }
        });

        this.saveToCache('player', this.comparedPlayers);
    }

    addAlliance(id, name, world) {
        id = id.toString();
        this.removeAlliance(id, world);
        if (this.comparedAlliances[world] !== undefined) {
            this.comparedAlliances[world].push({
                id: id,
                name: name,
            });
        } else {
            this.comparedAlliances[world] = [];
            this.comparedAlliances[world].push({
                id: id,
                name: name,
            });
        }
        this.update$.next();

        let snackBarRef = this.snackBar.open('Alliance added to the comparison', 'Show comparison', {
            duration: 6000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: COMPARE_TOAST,
        });
        snackBarRef.onAction().subscribe((response) => {
            // if (this.router.url.indexOf('/compare') == -1) {
            this.router.navigate(['/compare/alliance/' + world]);
            this.doHideSearch$.next();
            // } else {
            //   this.doCompareAlliance$.next();
            // }
        });

        this.saveToCache('alliance', this.comparedAlliances);
    }

    removePlayer(id, world) {
        if (this.comparedPlayers[world]) {
            let delId: any;
            Object.keys(this.comparedPlayers[world]).forEach((key) => {
                if (this.comparedPlayers[world][key].id == id) {
                    delId = key;
                }
            });
            if (delId !== undefined) {
                this.comparedPlayers[world].splice(delId, 1);
            }
            if (this.comparedPlayers[world].length == 0) this.clearPlayers(world);
            this.update$.next();
            this.saveToCache('player', this.comparedPlayers);
        }
    }

    removeAlliance(id, world) {
        if (this.comparedAlliances[world]) {
            let delId: any;
            Object.keys(this.comparedAlliances[world]).forEach((key) => {
                if (this.comparedAlliances[world][key].id == id) {
                    delId = key;
                }
            });
            if (delId !== undefined) {
                this.comparedAlliances[world].splice(delId, 1);
            }
            if (this.comparedAlliances[world].length == 0) this.clearAlliances(world);
            this.update$.next();
            this.saveToCache('alliance', this.comparedAlliances);
        }
    }

    clearPlayers(world) {
        if (this.comparedPlayers[world] !== undefined) {
            delete this.comparedPlayers[world];
        }
        this.update$.next();
        this.saveToCache('player', this.comparedPlayers);
    }

    clearAlliances(world) {
        if (this.comparedAlliances[world] !== undefined) {
            delete this.comparedAlliances[world];
        }
        this.update$.next();
        this.saveToCache('alliance', this.comparedAlliances);
    }

    saveToCache(type, data) {
        LocalCacheService.set('/compare/' + type, data, 120);
    }

    getFromCache(type) {
        return LocalCacheService.get('/compare/' + type);
    }
}

@Component({
    selector: 'compare-snack',
    template: "{{data}} <a routerLink='/compare'>Show comparison</a>",
})
export class CompareSnackbar {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
