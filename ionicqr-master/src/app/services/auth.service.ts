import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { globalApi } from '../global';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  uri: string = globalApi.uri;
  
  public token: any;
  public options: any;
  public header: any;

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService,
    private storageS:StorageService,
  ) {
   }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<{ access_token: string }>(this.uri + '/auth/login', { email: email, password: password })
      .pipe(
        map(result => {
          localStorage.setItem('access_token', result.access_token);
          this.storageS.set('access_token',result.access_token);
          return true;
        })
      );
  }
  /**
   * Funcion para salir del sistema
   */
  logout() {
    localStorage.removeItem('access_token');
    this.storageS.remove('access_token');
  }
  /**
   * Funcion que valida si el usuario aun tiene los privilegios para estar en el sistema
   * por medio de la duracion del token que tiene asignado
   */
  loggedIn(): boolean {
    const token: any = localStorage.getItem('access_token');
    if (!this.jwtHelper.isTokenExpired(token)) {
      return true;
    } else {
      localStorage.removeItem('access_token');
      return false;
    }
  }

  userAccessInfo() {
    if (this.loggedIn()) {

      const token: any = localStorage.getItem('access_token');
      const tokenPayload = this.jwtHelper.decodeToken(token);
    }
  }

  getRolesVistas(): Observable<any> {
    this.token = localStorage.getItem('access_token');
    this.header = new HttpHeaders({ "method": "post", "Authorization": this.token });
    this.options = { headers: this.header };
    return this.http.get(this.uri + "/rolesVistas", this.options);
  }
}
