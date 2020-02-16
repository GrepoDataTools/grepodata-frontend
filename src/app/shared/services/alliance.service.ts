import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../core/interfaces/responses/api-response';
import { Alliance } from '../core/interfaces/alliance';


@Injectable()
export class AllianceService {
    constructor(private http: HttpClient) {}

    fetchAlliancesByName(name: string): Observable<Alliance[]> {
        return this.http.get(`https://api.grepodata.com/alliance/search?query=${name}`).pipe(map((response: ApiResponse<Alliance[]>) => response.results));
    }
}
