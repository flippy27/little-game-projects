import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { globalApi } from '../global';

@Injectable({
  providedIn: 'root'
})
export class CargadorServiceService {
  uri = globalApi.uri;
  public header: any;
  public header2: any;
  public host: any;
  public token: any;
  public options: any;
  public options2: any;
  constructor(
    private http: HttpClient,

  ) {

    this.token = localStorage.getItem('access_token');

    this.header = new HttpHeaders({ "method": "post", "Authorization": this.token });
    this.options = { headers: this.header };

    this.header2 = new HttpHeaders({ 'Content-Type': 'application/json', "method": "post", "Authorization": this.token });
    this.options2 = { headers: this.header };

  }

  getTiposCables() {
    return this.http.get(this.uri + "/tiposCables", this.options);
  }
  cargadoresPorEmpresa(data): Observable<any> {

    return this.http.post(this.uri + "/cargadoresPorEmpresa", data, this.options);
  }
  mangueraPorCargador(data): Observable<any> {

    return this.http.post(this.uri + "/mangueraPorCargador", data, this.options);
  }
  ultimasalarmasMangueras(data): Observable<any> {

    return this.http.post(this.uri + "/ultimasalarmasMangueras", data, this.options)
  }
}