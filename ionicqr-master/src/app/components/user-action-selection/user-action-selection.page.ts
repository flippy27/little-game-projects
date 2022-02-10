import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CargadorServiceService } from '../../services/cargador-service.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
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
  userTransactions = [];
  user_id;
  usuarioNormal;
  favoritos = [];
  favoritosTxt;
  favoritoBoolean: boolean = false;
  cargadoresFavoritos = [];
  cargadoresNoFavoritos = [];
  constructor(
    private jwtHelper: JwtHelperService,
    private cargadorService: CargadorServiceService,
    private router: Router,
    private auth: AuthService,
    private barcodeScanner: BarcodeScanner,
    private storage: StorageService,

  ) { }

  async ngOnInit() {
    this.changeFavFilter();
    const token: any = localStorage.getItem('access_token');
    this.tokenPayload = this.jwtHelper.decodeToken(token);
    this.user_id = this.tokenPayload.user_id;
    if (this.tokenPayload.user_id == 54 || this.tokenPayload.user_id == 55) {//main user o admin
      this.usuarioNormal = false;
    } else {//usuario normal
      this.usuarioNormal = true;
    }
    this.getCargadores();

  }
  changeFavFilter() {
    this.favoritoBoolean = !this.favoritoBoolean;
    if (this.favoritoBoolean) {
      this.favoritosTxt = "Ver favoritos";
      this.cargadores = this.cargadoresNoFavoritos;
    } else {
      this.favoritosTxt = "Favoritos"
      this.cargadores = this.cargadoresFavoritos;
    }
  }
  getFavoritos() {
    this.cargadoresFavoritos = [];
    this.cargadorService.getFavoritosByUserIDAndType({ usuarios_id: this.user_id, tipos_favoritos_id: 1 }).subscribe(x => {
      this.favoritos = x;

      this.cargadores.forEach(y => {
        let t = this.favoritos.find(z => { return z.id_valor_favorito == y.id && z.habilitado == 1 });

        if (t != null) {
          this.cargadoresFavoritos.push(y);
        }
      })
    })
  }
  getHeartIcon(cargador) {
    let temp = this.favoritos.find(x => { return x.id_valor_favorito == cargador.id });
    if (temp != null && temp.habilitado == 1) {
      return "heart"
    } else {
      return "heart-outline"
    }

  }
  setFavorito(cargador) {
    let temp = this.favoritos.find(x => { return x.id_valor_favorito == cargador.id });
    let habilitado = 0;
    if (temp != null) {
      if (temp.habilitado == 1) {
        habilitado = 0;
      } else {
        habilitado = 1;
      }
      this.cargadorService.updateFavorito({ habilitado: habilitado, usuarios_id: this.tokenPayload.user_id, id_valor_favorito: cargador.id }).subscribe(res => {
        this.getFavoritos();
      })
    } else {
      this.cargadorService.setFavorito({ usuarios_id: this.tokenPayload.user_id, tipos_favoritos_id: 1, id_valor_favorito: cargador.id }).subscribe(res => {
        this.getFavoritos();
      })
    }

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

          this.cargadoresNoFavoritos = res;
          this.cargadores = res;
          this.getFavoritos();
          //this.loading = false;
          this.prepareDatosMangueras();
        })
      })
    })
  }
  prepareDatosMangueras() {
    let temparr = [];
    let manguerasIds = [];

    this.cargadores.forEach(x => {
      x.mangueras.forEach(y => {
        manguerasIds.push(y.id)
      })
    })


    temparr.push(this.cargadorService.ultimasalarmasMangueras({ mangueras_ids: manguerasIds }));

    this.getDatosMangueras(temparr);
  }
  ultimosManguera = [];
  getDatosMangueras(arr) {
    let allMangueras = [];
    let obv = forkJoin(arr).subscribe(res => {
      res.forEach((x: any) => {
        x.forEach(y => {
          if (y != null) {
            this.ultimosManguera.push(y);
          }
        })

      })
      obv.unsubscribe();
      setTimeout(() => {
        this.getDatosMangueras(arr);
      }, 5000);
    });
  }
  transactions = [];
  getDatosMangueraAdminUser(arr) {
    let obv = forkJoin(arr).subscribe(res => {
      this.ultimosManguera = [];
      res.forEach((x: any) => {
        x.forEach(y => {
          if (y != null) {
            this.ultimosManguera.push(y);
          }
        })
      })
      obv.unsubscribe();
      setTimeout(() => {
        this.prepareDatosMangueras();
      }, 5000);
    });

  }
  getDatosManguerasNormalUser(arr) {

    let allMangueras = [];

    //get user transactions
    this.cargadorService.getAllUserTransactions({ usuarios_id: this.user_id }).subscribe(res => {
      //get transactions data
      let tarr = [];
      res.forEach(x => {
        tarr.push(this.cargadorService.getDatosOcppTransactionID({ transaction_id: x.transactionId }));
      })
      forkJoin(tarr).subscribe(val => {
        this.transactions = val;

        this.userTransactions = res;
        this.ultimosManguera = [];
        let obv = forkJoin(arr).subscribe(res => {
          res.forEach((x: any) => {
            x.forEach(y => {
              this.ultimosManguera.push(y);
            })
          })
          obv.unsubscribe();
          setTimeout(() => {
            this.prepareDatosMangueras();
          }, 5000);
        });
      })
    })
  }
  getChargingOrNot(cargador) {
    let gradientBgGray = 'linear-gradient(90deg, rgba(255,255,255,1) 87%, rgba(78,80,84,1) 87%, rgba(78,80,84,1) 100%)'
    let gradientBgBlue = 'linear-gradient(90deg, rgba(255,255,255,1) 87%, rgba(48,48,148,1) 87%, rgba(48,48,148,1) 100%)'
    let gradientBgGreen = 'linear-gradient(90deg, rgba(255,255,255,1) 87%, rgba(133,175,55,1) 87%, rgba(133,175,55,1) 100%)';
    if (this.ultimosManguera.length == 0) {
      return { background: '#white', color: '#4e5054', state: true };
    }

    let item1 = this.ultimosManguera.find(x => { return x.mangueras_id == cargador.mangueras[0].id && x != null });
    let item2 = this.ultimosManguera.find(x => { return x.mangueras_id == cargador.mangueras[1].id && x != null });
    if(item1 == null && item2 == null){
      return { background: '#white', color: '#4e5054', state: true };
    }
    let currentCharging = this.userTransactions.find(x => { return x.estado_actual == 0 });
    //ninguna manguera esta cargando
    if (item1.estado != "Charging" && item2.estado != "Charging") {

      return { background: gradientBgGreen, color: '#4e5054', state: true };

    } else {
      if (this.usuarioNormal) {
        //una manguera esta cargando, tengo qe chequear si es el cargador que yo estoy ocupando
        //ver si hay algun dato que este cargando
        if (currentCharging) {
          //comparar si el dato que esta cargando es una manguera de mi cargador, o no
          //si es de mi cargador devuelvo el cargando
          if (currentCharging.mangueras_id == cargador.mangueras[0].id || currentCharging.mangueras_id == cargador.mangueras[1].id) {
            return { background: gradientBgBlue, color: '#4e5054', state: true };
            return { background: '#303094', color: 'white', state: true };
            //si no es mio, pero esta cargando, devuelvo el no disponible
          } else {
            return { background: gradientBgGray, color: '#4e5054', state: false };

          }
        } else {
          return { background: gradientBgGray, color: '#4e5054', state: false };
        }
      } else {
        return { background: gradientBgGray, color: '#4e5054', state: true };

      }
    }

  }
  seleccionCargadores(data) {
    this.router.navigate(['/informacion-cargador'], {
      state: {
        data
      }
    });
  }
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('');
  }
  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedData = barcodeData;
      let cargador = this.cargadores.find(x => { return x.id == this.scannedData.text });
      if (cargador) {
        this.router.navigate(['/informacion-cargador'], {
          state: {
            data: cargador
          }
        });
      } else {
        //ver que hacer cuando no ahya un id cargador en el qr
      }
    }).catch(err => {
      console.error('Error', err);
    });
  }
}
