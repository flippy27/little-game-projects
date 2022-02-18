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
  getAllUserTransactions(data: any): Observable<any> {
    return this.http.post(this.uri + "/getAllUserTransactions", data, this.options)
  }
  getDatosOcppTransactionID(data: any): Observable<any> {
    return this.http.post(this.uri + "/getDatosOcppTransactionID", data, this.options)
  }
  getFavoritosByUserIDAndType(data: any): Observable<any> {
    return this.http.post(this.uri + "/getFavoritosByUserIDAndType", data, this.options)
  }
  setFavorito(data: any): Observable<any> {
    return this.http.post(this.uri + "/setFavorito", data, this.options)
  }
  updateFavorito(data: any): Observable<any> {
    return this.http.post(this.uri + "/updateFavorito", data, this.options)
  }
  datosMangueras(data): Observable<any> {

    return this.http.post(this.uri + "/datosMangueras", data, this.options)
  }
  datosAlarmasMangueras(data): Observable<any> {

    return this.http.post(this.uri + "/datosAlarmasMangueras", data, this.options)
  }
  datosMangueraColbun(data): Observable<any> {
    return this.http.post(this.uri + "/datosMangueraColbun", data, this.options)
  }
  fullCargadoresPorEmpresa(data): Observable<any> {
    return this.http.post(this.uri + "/fullCargadoresPorEmpresa", data, this.options)
  }
  getEmpresa(empresa_id): Observable<any> {
    return this.http.get(this.uri + "/empresas/" + empresa_id, this.options)
  }
  
}
