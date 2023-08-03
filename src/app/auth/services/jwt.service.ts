import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { reject } from 'q';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Globals } from '../../globals';
import { LocalCacheService } from '../../services/local-cache.service';

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

  public isExpiredToken(token): Promise<boolean> {
    return new Promise(resolve => {
      try {
        // get expiration from token payload
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

        // get time offset from server
        this.getServerTimeOffset().then(
          (offset: any) => {
            console.log("GD auth: using server offset: ", offset);
            if (!offset || offset == false || offset == null || isNaN(offset)) {
              offset = 0;
            }
            // check if token is expired
            const expired = (Date.now() / 1000) >= exp - 600 + offset
            resolve(expired);
          },
          (reject) => {
            // continue without offset
            console.log("GD auth: server offset rejected, using no offset");
            const expired = (Date.now() / 1000) >= exp - 600
            resolve(expired);
          }
        );
      } catch (e) {
        console.log('Error checking token expiration: ', e);
        resolve(true);
      }
    });
  }

  public get refreshToken(): string {
    return localStorage.getItem('refresh_token');
  }

  public accessToken(force_login_required = true): Promise<string> {
    return new Promise(resolve => {
      let token = localStorage.getItem('access_token');
      if (!token) {
        // no token.. login required
        console.log('no access token', force_login_required);
        this.rejectToken(force_login_required);
        throw new Error('no access token');
      }
      this.isExpiredToken(token).then(is_expired => {
        if (is_expired) {
          // expired token, try a refresh
          console.log('access token is expired, refreshing');
          if (this.refreshToken !== null) {
            // Try to refresh
            this.refreshAccessToken().subscribe((response) => {
                if (response.success_code && response.success_code === 1101) {
                  // got a valid token via refresh, save locally & resolve
                  localStorage.setItem('access_token', response.access_token);
                  localStorage.setItem('refresh_token', response.refresh_token);
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
            reject(null);
          }
        } else {
          // valid token found
          resolve(token)
        }
      }, (rejected) => {
        resolve(token)
      }
      );
    });
  }

  /**
   * Retrieves offset in seconds between server time and client time
   */
  public getServerTimeOffset() {
    let url =  '/gd/sync';
    let data = LocalCacheService.get(url);
    if (data !== false) {
      // Return server time from local cache
      return new Promise(resolve => {
        resolve(data)
      });
    } else {
      // Get server time from API
      return new Promise(resolve =>
      {
        this.httpClient.get<any>(apiUrl + '/sync').subscribe(
          (response) => {
            if ('time' in response) {
              let offset = Math.round(Date.now()/1000) - response.time;
              console.log("GD auth: calculated Server-Client offset: ", offset);
              LocalCacheService.set(url, offset, (20));
              resolve(offset);
            } else {
              resolve(false);
            }
          },
          (error) => {
            console.log("GD auth: error retrieving server sync: ", error);
            resolve(false);
          }
        );
      });
    }
  }

  private rejectToken(force_login_required) {
    console.log('reject', force_login_required);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    if (force_login_required) {
      this.navigate();
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
      this.navigate();
    }

  }

  navigate() {
    // store original url so we can redirect after login
    let url = this.router.url;
    if (url != '/indexer' && (
      url.indexOf('/indexer/') !== -1
      || url.indexOf('/profile/') !== -1
      || url.indexOf('/intel/') !== -1
      || url.indexOf('/operations/') !== -1
    )) {
      this.globals.set_redirect_url(url);
      console.log('Setting redirect url: ', url);
    }

    // Navigate to login page
    this.router.navigate(['/indexer']);
  }
}
