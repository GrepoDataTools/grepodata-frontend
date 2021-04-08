import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";

const apiUrl = environment.apiUrl;
@Injectable()
export class MessageService {

  constructor(private http: HttpClient) {}

  sendMessage(body, mail, name, captcha, files=null) {
    if (captcha == '' || captcha == undefined) captcha = '_';
    if (mail == '' || mail == undefined) mail = '_';
    if (name == '' || name == undefined) name = '_';
		// let options: any = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})};
		let data = {
      'name': name,
      'mail': mail,
      'message': body,
      'captcha': captcha
    }
    const formData: FormData = new FormData();

		console.log(files);
		if (files) {
      for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        formData.append(i.toString(), files[i]);
      }
    }
    formData.append("data", JSON.stringify(data));
    return this.http.post(apiUrl + '/message/add', formData);
  }

}
