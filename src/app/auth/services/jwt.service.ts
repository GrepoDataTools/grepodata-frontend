import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import {Router} from '@angular/router';
import {reject} from 'q';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(
    private router: Router,
    private httpClient: HttpClient
  ) {}

  public get refreshToken(): string {
    return localStorage.getItem('refresh_token');
  }

  public accessToken() {
    return new Promise(resolve => {
      let token = localStorage.getItem('access_token');
      let payload = jwt_decode(token);
      if (payload.exp < Date.now() / 1000 - 60) {
        console.log('refreshing');
        localStorage.removeItem('access_token');
        if (this.refreshToken !== null) {
          // Try to refresh
          this.refreshAccessToken().subscribe((response) => {
              if (response.success_code && response.success_code === 1101) {
                resolve(localStorage.getItem('access_token'));
              } else {
                localStorage.removeItem('refresh_token');
                this.logout();
                reject(null);
              }
            },
            (error) => {
              console.log("Unable to refresh with token", error);
              this.logout();
              reject(null);
            })
        } else {
          this.logout();
          reject(null);
        }
      } else {
        resolve(token)
      }
    });
  }

  public login(email: string, password: string, captcha: string) {
    let data = new HttpParams().set('mail', email).set('password', password).set('captcha', captcha);
    return this.httpClient
      .post<any>(apiUrl + '/auth/login', data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);
        })
      );
  }

  public enableScriptLink(access_token, script_token) {
    let data = new HttpParams().set('access_token', access_token).set('script_token', script_token);
    return this.httpClient
      .post<any>(apiUrl + '/auth/authenticatescriptlink', data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      });
  }

  public loginWithDiscord(code: string) {
    const data = new FormData();
    data.append('client_id', environment.discordClientId);
    data.append('client_secret', environment.discordClientSecret);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', 'http://localhost:4200/login');
    data.append('scope', 'identify');
    data.append('code', code);

    return this.httpClient.post('https://discord.com/api/oauth2/token', data);
  }

  public register(username: string, email: string, password: string, captcha: string) {
    let data = new HttpParams()
      .set('username', username)
      .set('mail', email)
      .set('password', password)
      .set('captcha', captcha);
    return this.httpClient
      .post<any>(apiUrl + '/auth/register', data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);
        })
      );
  }

  /**
   * Check if access_token is valid
   * throws 401 if invalid or expired token
   * @returns {Observable<any>}
   */
  public verifyToken(access_token) {
    let data = new HttpParams().set('access_token', access_token);
    return this.httpClient
      .post<any>(apiUrl + '/auth/token', data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access_token);
        })
      );
  }

  /**
   * Get a new access_token
   * throws 401 if invalid or expired refresh token
   * @returns {Observable<any>}
   */
  public refreshAccessToken() {
    let data = new HttpParams().set('refresh_token', this.refreshToken);
    return this.httpClient
      .post<any>(apiUrl + '/auth/refresh', data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);
        })
      );
  }

  public forgot(email: string, captcha: string) {
    let data = new HttpParams().set('mail', email).set('captcha', captcha);
    return this.httpClient.post<any>(apiUrl + '/auth/reset', data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    });
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);
  }
}
