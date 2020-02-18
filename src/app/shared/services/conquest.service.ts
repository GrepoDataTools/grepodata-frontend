import {Component, Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import {environment} from '../../../environments/environment';
import {ConquestDialog} from '../dialogs/conquest/conquest.component';

const apiUrl = environment.apiUrl;

@Injectable()
export class ConquestService {

  constructor(
		private dialog: MatDialog,
		private http: HttpClient) {}

  getConquests(type, world, id, from, size, filters) {
    const url = apiUrl + '/conquest';
    let params = new HttpParams();
    if (typeof type != 'undefined') params = params.append('type', type);
    if (typeof world != 'undefined') params = params.append('world', world);
    if (typeof id != 'undefined') params = params.append('id', id);
    if (typeof from != 'undefined') params = params.append('from', from);
    if (typeof size != 'undefined') params = params.append('size', size);
		Object.keys(filters).forEach(e => {
			let value = filters[e];
			if (value === null || value === '') {
				value = '_';
			}
			params = params.append(e, value);
		});
    return this.http.get(url, { params: params });
  }

	public showConquestDialog(type, id, name, world, date=null): void {
  	let filters = {
			id: id,
			type: type,
			world: world,
			date: date,
		};

		let dialogRef = this.dialog.open(ConquestDialog, {
			// width: '70%',
			// height: '85%',
			autoFocus: false,
			data: {
				filters: filters,
				name: name
			}
		});

		dialogRef.afterClosed().subscribe(result => {});
	}
}
