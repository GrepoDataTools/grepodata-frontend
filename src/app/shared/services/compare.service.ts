import {Component, Inject, Injectable} from '@angular/core';
import {Subject} from "rxjs";
import { MAT_SNACK_BAR_DATA, MatSnackBar } from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {LocalStorageService} from './local-storage.service';

@Injectable()
export class CompareService {

  // cache vars
  private comparedPlayers : any;
  private comparedAlliances : any;

  public update$: any = new Subject();
  public doComparePlayer$: any = new Subject();
  public doCompareAlliance$: any = new Subject();
  public doHideSearch$: any = new Subject();
  public doSearchPlayerWorlds$: any = new Subject();

  constructor(
    public snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    public cache: LocalStorageService) {
    
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
  
  getAllPlayers(){
    return this.comparedPlayers;
  }

  getAllAlliances(){
    return this.comparedAlliances;
  }

  getComparedPlayers(world){
    if (this.comparedPlayers[world] !== undefined) {
      return this.comparedPlayers[world];
    } else {
      return false;
    }
  }

  getComparedAlliances(world){
    if (this.comparedAlliances[world] !== undefined) {
      return this.comparedAlliances[world];
    } else {
      return false;
    }
  }

  addPlayer(id, name, world){
    id = id.toString();
    this.removePlayer(id, world);
    if (this.comparedPlayers[world] !== undefined) {
      this.comparedPlayers[world].push({
        id: id,
        name: name
      });
    } else {
      this.comparedPlayers[world] = [];
      this.comparedPlayers[world].push({
        id: id,
        name: name
      });
    }
    this.update$.next();

    // this.snackBar.openFromComponent(CompareSnackbar, {data: 'Player added!', duration: 3000, panelClass: ['success-snack']});

    let snackBarRef = this.snackBar.open('Player added!', 'Show comparison',
      {duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom', panelClass: ['compare-snackbar']});
    snackBarRef.onAction().subscribe(response => {
      // if (this.router.url.indexOf('/compare') != -1) {
			this.router.navigate(['/compare/player/'+world]);
			this.doHideSearch$.next();
      // } else {
      //   this.doComparePlayer$.next();
      // }
    });

    this.saveToCache('player', this.comparedPlayers);
  }

  addAlliance(id, name, world){
    id = id.toString();
    this.removeAlliance(id, world);
    if (this.comparedAlliances[world] !== undefined) {
      this.comparedAlliances[world].push({
        id: id,
        name: name
      });
    } else {
      this.comparedAlliances[world] = [];
      this.comparedAlliances[world].push({
        id: id,
        name: name
      });
    }
    this.update$.next();

    let snackBarRef = this.snackBar.open('Alliance added!', 'Show comparison',
      {duration: 5000, horizontalPosition: 'center', verticalPosition: 'bottom', panelClass: ['compare-snackbar']});
    snackBarRef.onAction().subscribe(response => {
      // if (this.router.url.indexOf('/compare') == -1) {
			this.router.navigate(['/compare/alliance/'+world]);
			this.doHideSearch$.next();
      // } else {
      //   this.doCompareAlliance$.next();
      // }
    });

    this.saveToCache('alliance', this.comparedAlliances);
  }
  
  removePlayer(id, world){
    if (this.comparedPlayers[world]) {
      let delId : any;
      Object.keys(this.comparedPlayers[world]).forEach(key => {
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
  
  removeAlliance(id, world){
    if (this.comparedAlliances[world]) {
      let delId : any;
      Object.keys(this.comparedAlliances[world]).forEach(key => {
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
  
  clearPlayers(world){
    if (this.comparedPlayers[world] !== undefined) {
      delete this.comparedPlayers[world];
    }
    this.update$.next();
    this.saveToCache('player', this.comparedPlayers);
  }
  
  clearAlliances(world){
    if (this.comparedAlliances[world] !== undefined) {
      delete this.comparedAlliances[world];
    }
    this.update$.next();
    this.saveToCache('alliance', this.comparedAlliances);
  }

  saveToCache(type, data) {
    LocalStorageService.set('/compare/'+type, data, 120)
  }

  getFromCache(type) {
    return LocalStorageService.get('/compare/'+type);
  }

}

@Component({
  selector: 'compare-snack',
  template: '{{data}} <a routerLink=\'/compare\'>Show comparison</a>'
})
export class CompareSnackbar {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}