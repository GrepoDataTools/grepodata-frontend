import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { MatDialog } from "@angular/material/dialog";
import { environment } from "../../../environments/environment";
import { ConquestDialogComponent } from "../components/conquest-dialog/conquest-dialog.component";

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ConquestService {

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  getConquests(type: string, world: string, id: string, from: string, size: string, filters: Object) {
    const httpParams: HttpParams = new HttpParams();

    type && httpParams.append('type', type);
    world && httpParams.append('world', world);
    id && httpParams.append('id', id);
    from && httpParams.append('from', from);
    size && httpParams.append('size', size);

    Object.keys(filters).map((filter: string) => {
      filters[filter] ? httpParams.append(filter, filters[filter]) : httpParams.append(filter, '_');
    })

    return this.http.get(`${apiUrl}/conquest`, { params: httpParams });
  }

  showDialog(type: string, id: string, name: string, world: string, date: Date) {
    this.dialog.open(ConquestDialogComponent, {
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
