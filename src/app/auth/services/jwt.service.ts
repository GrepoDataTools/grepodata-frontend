import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import {Router} from '@angular/router';
import {reject} from 'q';
import {LocalCacheService} from '../../services/local-cache.service';
import {Globals} from '../../globals';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  constructor(
    private globals: Globals,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  public isExpiredToken(token): boolean {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const { exp } = JSON.parse(jsonPayload);
      const expired = Date.now() / 1000 >= exp - 600
      return expired
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  public get refreshToken(): string {
    let refresh_token = localStorage.getItem('refresh_token');
    if (refresh_token != null && this.isExpiredToken(refresh_token)) {
      console.log('refresh token is expired.');
      localStorage.removeItem('refresh_token');
      return null;
    }
    return refresh_token;
  }

  public accessToken(force_login_required = true): Promise<string> {
    return new Promise(resolve => {
      let token = localStorage.getItem('access_token');
      if (!token) {
        // no token.. login required
        console.log('no access token', force_login_required);
        this.rejectToken(force_login_required);
        throw new Error(null);
      }
      if (this.isExpiredToken(token)) {
        // expired token, try a refresh
        console.log('access token is expired, refreshing');
        localStorage.removeItem('access_token');
        if (this.refreshToken !== null) {
          // Try to refresh
          this.refreshAccessToken().subscribe((response) => {
              if (response.success_code && response.success_code === 1101) {
                // got a valid token via refresh
                resolve(response.access_token);
              } else {
                // unable to refresh, discard tokens and reject (new login required)
                console.log("Unable to refresh with token", response);
                this.rejectToken(force_login_required);
                if (!force_login_required) {
                  resolve("refresh_failed");
                } else {
                  reject(null);
                }
              }
            },
            (error) => {
              // unable to refresh, discard tokens and reject (new login required)
              console.log("Unable to refresh with token", error);
              this.rejectToken(force_login_required);
              if (!force_login_required) {
                resolve("refresh_failed");
              } else {
                reject(null);
              }
            })
        } else {
          // No refresh token.. login required
          console.log("Missing refresh token. Login required");
          this.rejectToken(force_login_required);
          throw new Error(null);
        }
      } else {
        // valid token found
        resolve(token)
      }
    });
  }

  private rejectToken(force_login_required) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    if (force_login_required) {
      this.router.navigate(['/indexer']);
    }
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

  // TODO
  // public loginWithDiscord(code: string) {
  //   const data = new FormData();
  //   data.append('client_id', environment.discordClientId);
  //   data.append('client_secret', environment.discordClientSecret);
  //   data.append('grant_type', 'authorization_code');
  //   data.append('redirect_uri', 'http://localhost:4200/login');
  //   data.append('scope', 'identify');
  //   data.append('code', code);
  //
  //   return this.httpClient.post('https://discord.com/api/oauth2/token', data);
  // }

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

  public changePasswordWithToken(token: string, password: string, captcha: string) {
    let data = new HttpParams()
      .set('token', token)
      .set('new_password', password)
      .set('captcha', captcha);
    return this.httpClient
      .post<any>(apiUrl + '/auth/changepassword', data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);
        })
      );
  }

  public changeActivePassword(access_token: string, old_password: string, new_password: string, captcha: string) {
    let data = new HttpParams()
      .set('access_token', access_token)
      .set('old_password', old_password)
      .set('new_password', new_password)
      .set('captcha', captcha);
    return this.httpClient
      .post<any>(apiUrl + '/auth/changepassword', data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('refresh_token', res.refresh_token);
        })
      );
  }

  public newActivationEmail(access_token: string) {
    return this.httpClient
      .get<any>(apiUrl + '/auth/newconfirm', {
        headers: new HttpHeaders({ 'access_token': access_token }),
      })
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

  public deleteAccount(access_token, password) {
    let data = new HttpParams().set('access_token', access_token).set('password', password);
    return this.httpClient
      .post<any>(apiUrl + '/auth/deleteaccount', data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      });
  }

  public deleteAccountConfirm(access_token, token, captcha) {
    let data = new HttpParams().set('access_token', access_token).set('token', token).set('captcha', captcha);
    return this.httpClient
      .post<any>(apiUrl + '/auth/deleteaccountconfirm', data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      });
  }

  logout(navigate = true) {
    // Clear local cache items
    LocalCacheService.remove('access_token');
    LocalCacheService.remove('refresh_token');
    this.globals.delete_all_indexes();
    this.globals.delete_top_indexes();
    this.globals.delete_recent_intel();

    if (navigate === true) {
      this.router.navigate(['/indexer']);
    }

  }
}
