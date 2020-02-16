import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from '../../../environments/environment';

const apiUrl = environment.apiUrl;
@Injectable()
export class CaptchaService {

  constructor(private http: HttpClient) {}

  // NOTE: this method is now unused because the initial captcha key is just send with each request and verified along with the request
  checkCaptcha(response) {
    let options:any = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})};
		let data = new HttpParams()
			.set('response', response);
    return this.http.post(apiUrl + '/captcha', data, options);
  }

}
