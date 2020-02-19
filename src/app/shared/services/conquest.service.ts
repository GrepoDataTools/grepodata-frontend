import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { MatDialog } from "@angular/material/dialog";
import { ConquestDialog } from "../dialogs/conquest-dialog/conquest.component";

const apiUrl = environment.apiUrl;

@Injectable()
export class ConquestService {

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  getConquests(type: string, world: string, id: string, from: string, size: string, filters: Object) {
    let httpParams: HttpParams = new HttpParams();

    if (typeof type != 'undefined') httpParams = httpParams.append('type', type);
    if (typeof world != 'undefined') httpParams = httpParams.append('world', world);
    if (typeof id != 'undefined') httpParams = httpParams.append('id', id);
    if (typeof from != 'undefined') httpParams = httpParams.append('from', from);
    if (typeof size != 'undefined') httpParams = httpParams.append('size', size);

    Object.keys(filters).forEach(e => {
      let value = filters[e];
      if (value === null || value === '') {
        value = '_';
      }
      httpParams = httpParams.append(e, value);
    });

    return this.http.get(`${apiUrl}/conquest`, { params: httpParams });
  }

  showDialog(type: string, id: string, name: string, world: string, date: Date) {
    this.dialog.open(ConquestDialog, {
      autoFocus: false,
      data: {
        filters: {
          id,
          type,
          world,
          date
        },
        name
      }
    }).afterClosed().subscribe(() => {});
  }
}
