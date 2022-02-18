import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { forkJoin } from 'rxjs';
import { CargadorServiceService } from 'src/app/services/cargador-service.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'lista-cargadores',
  templateUrl: './lista-cargadores.component.html',
  styleUrls: ['./lista-cargadores.component.scss'],
})
export class ListaCargadoresComponent implements OnInit {
  cargadores;

  favoritos = [];
  favoritosTxt;
  favoritoBoolean: boolean = false;
  cargadoresFavoritos = [];
  cargadoresNoFavoritos = [];
  ultimosManguera = [];
  tiposConectores;
  userTransactions = [];
  user_id;
  usuarioNormal;
  tokenPayload;
  loading = true;
  transactions = [];


  constructor(
    private cargadorService: CargadorServiceService,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private modalCtrl:ModalController,


  ) { }

  ngOnInit() {
    
    const token: any = localStorage.getItem('access_token');
    this.tokenPayload = this.jwtHelper.decodeToken(token);
    this.user_id = this.tokenPayload.user_id;
    if (this.tokenPayload.user_id == 54 || this.tokenPayload.user_id == 55) {//main user o admin
      this.usuarioNormal = false;
    } else {//usuario normal
      this.usuarioNormal = true;
    }
    //this.loading = true;
    this.getCargadores();
    this.changeFavFilter();


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
  getChargingOrNot(cargador) {
    let gradientBgGray = 'linear-gradient(90deg, rgba(255,255,255,1) 87%, rgba(78,80,84,1) 87%, rgba(78,80,84,1) 100%)'
    let gradientBgBlue = 'linear-gradient(90deg, rgba(255,255,255,1) 87%, rgba(48,48,148,1) 87%, rgba(48,48,148,1) 100%)'
    let gradientBgGreen = 'linear-gradient(90deg, rgba(255,255,255,1) 87%, rgba(133,175,55,1) 87%, rgba(133,175,55,1) 100%)';
    if (this.ultimosManguera.length == 0) {
      return { background: '#white', color: '#4e5054', state: true };
    }

    let item1 = this.ultimosManguera.find(x => { return x.mangueras_id == cargador.mangueras[0].id && x != null });
    let item2 = this.ultimosManguera.find(x => { return x.mangueras_id == cargador.mangueras[1].id && x != null });
    if (item1 == null && item2 == null) {
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
  seleccionCargadores(data) {
    this.router.navigate(['/informacion-cargador'], {
      state: {
        data
      }
    });
  }
  
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
  getDatosMangueras(arr) {    
    let obv = forkJoin(arr).subscribe(res => {
      console.log('res ultimas mangueras',res);
      this.ultimosManguera = [];
      res.forEach((x: any) => {
        x.forEach(y => {
          if (y != null) {
            this.ultimosManguera.push(y);
          }
        })
      })
      console.log('get datos manguera',this.ultimosManguera);
      obv.unsubscribe();
      setTimeout(() => {
        this.getDatosMangueras(arr);
      }, 5000);
    });
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
  getCargadores() {
    this.cargadorService.fullCargadoresPorEmpresa({ empresas_id: this.tokenPayload.empresas_id }).subscribe(result => {
      this.cargadoresNoFavoritos = result;
      this.cargadores = result;
      this.cargadores.sort((a, b) => {
        if (a.alias_equipo < b.alias_equipo) { return -1; }
        if (a.alias_equipo > b.alias_equipo) { return 1; }
        return 0;
      })
      this.cargadoresNoFavoritos.sort((a, b) => {
        if (a.alias_equipo < b.alias_equipo) { return -1; }
        if (a.alias_equipo > b.alias_equipo) { return 1; }
        return 0;
      })
      this.getFavoritos();
      this.prepareDatosMangueras();
    })
  }
  closeModal(){
    this.modalCtrl.dismiss();
  }

}
