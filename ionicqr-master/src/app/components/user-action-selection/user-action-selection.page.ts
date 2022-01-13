import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CargadorServiceService } from '../../services/cargador-service.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-user-action-selection',
  templateUrl: './user-action-selection.page.html',
  styleUrls: ['./user-action-selection.page.scss'],
})
export class UserActionSelectionPage implements OnInit {
  tokenPayload;
  cargadores;
  tiposConectores;
  scannedData;
  constructor(
    private jwtHelper: JwtHelperService,
    private cargadorService: CargadorServiceService,
    private router: Router,
    private auth:AuthService,
    private barcodeScanner: BarcodeScanner,

  ) { }

  ngOnInit() {

    const token: any = localStorage.getItem('access_token');
    this.tokenPayload = this.jwtHelper.decodeToken(token);
    this.getCargadores();

  }
  getCargadores() {
    this.cargadorService.getTiposCables().subscribe((result: any) => {
      this.tiposConectores = result;

      this.cargadores = [];

      this.cargadorService.cargadoresPorEmpresa({ empresas_id: this.tokenPayload.empresas_id }).subscribe(res => {
        let ids = [];

        res.forEach(x => {
          ids.push(this.cargadorService.mangueraPorCargador({ cargadores_id: x.id }));
        })
        forkJoin(ids).subscribe(val => {

          val.forEach((arrs: any) => {
            arrs.forEach((x: any) => {
              if (!x.tipo_conector) {
                x.tipo_conector = this.tiposConectores.find(a => { return a.id == x.tipos_cables_id });
              }
              let temp: any = res.find((y: any) => { return y.id == x.equipos_id });
              if (temp) {
                if (!temp.mangueras) {
                  temp.mangueras = [];
                }
                temp.mangueras.push(x);
              }
            })
          })

          this.cargadores = res;
          //this.loading = false;
          this.prepareDatosMangueras();
        })
      })
    })
  }
  prepareDatosMangueras() {
    let temparr = [];
    this.cargadores.forEach(x => {
      temparr.push(this.cargadorService.ultimasalarmasMangueras({ manguera_uno: x.mangueras[0].id, manguera_dos: x.mangueras[1].id }));
    });
    this.getDatosMangueras(temparr);
  }
  ultimosManguera = [];
  getDatosMangueras(arr) {
    let allMangueras = [];
    let obv = forkJoin(arr).subscribe(res => {
      res.forEach((x: any) => {
        x.forEach(y => {
          this.ultimosManguera.push(y);
        })
      })
      obv.unsubscribe();
      setTimeout(() => {
        this.getDatosMangueras(arr);
      }, 5000);
    });
  }
  getChargingOrNot(cargador) {
    if (this.ultimosManguera.length == 0) {
      return;
    }

    let item1 = this.ultimosManguera.find(x => { return x.mangueras_id == cargador.mangueras[0].id });
    let item2 = this.ultimosManguera.find(x => { return x.mangueras_id == cargador.mangueras[1].id });
    if (item1.estado != "Charging" && item2.estado != "Charging") {
      return false;
    } else {
      return true;
    }

  }
  seleccionCargadores(data) {
    this.router.navigate(['/informacion-cargador'], {
      state: {
        data
      }
    });
  }
  logout(){
    this.auth.logout();
    this.router.navigateByUrl('');
  }
  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.scannedData = barcodeData;
      if(this.scannedData.user == "colbun@colbun.cl" && this.scannedData.password == "123456"){
        this.router.navigate(['informacion-cargador'])
      }
     }).catch(err => {
         console.log('Error', err);
     });
  }
}
