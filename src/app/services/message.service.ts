import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";

const apiUrl = environment.apiUrl;
@Injectable()
export class MessageService {

  constructor(private http: HttpClient) {}

  sendMessage(body, mail, name, captcha) {
    if (captcha == '' || captcha == undefined) captcha = '_';
    if (mail == '' || mail == undefined) mail = '_';
    if (name == '' || name == undefined) name = '_';
		let options: any = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})};
    let data = new HttpParams()
			.set('name', name)
			.set('mail', mail)
      .set('message', body)
      .set('captcha', captcha);
    return this.http.post(apiUrl + '/message/add', data, options);
  }

}
