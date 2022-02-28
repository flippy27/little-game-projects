import { Component, OnInit } from '@angular/core';
import { Route, Router, RouteReuseStrategy } from '@angular/router';
import { CargadorServiceService } from '../../services/cargador-service.service';
import { AuthService } from '../../services/auth.service';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-informacion-cargador',
  templateUrl: './informacion-cargador.page.html',
  styleUrls: ['./informacion-cargador.page.scss'],
})
export class InformacionCargadorPage implements OnInit {
  cargador;
  cargadorImg;
  ovb;
  alarmasManguera;
  btnCargaActualClass;
  btnCargaActualActivated;
  is24Hours;
  textoBotonCargaActual;
  currentModal = null;

  latitud;
  longitud;
  zoom = 18;
  noneCharging = false;
  loading;
  markerIcon: any = {
    url: "../../assets/img/iconoMapaCargador.png",
    scaledSize: {
      width: 30,
      height: 40
    }
  }
  constructor(
    private cargadorService: CargadorServiceService,
    private auth: AuthService,
    private router: Router,
    private modalController: ModalController,
    private platform: Platform
  ) {
    this.platform.backButton.subscribeWithPriority(9999, () => {
      // do nothing
    });
  }

  ngOnInit() {

    this.loading = true;
    this.cargador = history.state.data;
    let token = localStorage.getItem('access_token');
    let tknInfo = this.auth.jwtHelper.decodeToken(token);
    this.latitud = this.cargador.latitud;
    this.longitud = this.cargador.longitud;


    this.getAlarmasMangueras();
  }
  ionViewDidEnter() {
    document.addEventListener("backbutton",function(e) {
      console.log("disable back button")
    }, false);
  }
  getAlarmasMangueras() {
    let manguerasIds = [];
    this.cargador.mangueras.forEach(x => {
      manguerasIds.push(x.id)
    })
    this.ovb = this.cargadorService.ultimasalarmasMangueras({ mangueras_ids: manguerasIds }).subscribe(res => {
      this.loading = false;
      this.alarmasManguera = res;
      if (res.length > 0) {
        this.cargador.mangueras.forEach(x => {
          let tempma = this.alarmasManguera.find(y => { return y.mangueras_id == x.id });
          x.estadoParaColor = tempma.estado;
          x.estadoCarga = tempma.estado
        })

        //check if none are charging
        let temp = this.cargador.mangueras.find(y => { return y.estadoCarga == "Charging" });
        if (temp == null) {
          this.noneCharging = true;
        }

        if (this.noneCharging) {
          this.cargador.mangueras.forEach(x => {
            this.cargadorImg = "/assets/img/cargador-verde-verde.png";
            this.btnCargaActualClass = "boton-carga-actual";
            this.btnCargaActualActivated = true;
            this.is24Hours = true;
            this.textoBotonCargaActual = 'Última Carga';
            x.whole_background = '#85af37';
            x.foreground_color = 'white';
            x.iconColor = 'assets/img/conector-' + x.tipo_conector.id + '-white.png';
            x.botonActivado = true;
            x.textBoton = 'Conecte manguera y presione para iniciar';
            x.disponibilidadText = "Disponible";
          })
        } else {

          this.btnCargaActualClass = "boton-carga-actual";
          this.btnCargaActualActivated = true;
          this.is24Hours = false;
          this.cargador.mangueras.forEach(x => {
            if (x.estadoCarga == "Charging") {
              if (x.numero_manguera == 1) {
                this.cargadorImg = "/assets/img/cargador-azul-verde.png";
              } else {
                this.cargadorImg = "/assets/img/cargador-verde-azul.png";
              }

              x.whole_background = '#4a72b2';
              x.foreground_color = 'white';
              x.iconColor = 'assets/img/conector-' + x.tipo_conector.id + '-white.png';
              x.botonActivado = true;
              x.textBoton = 'Cargando';
              x.disponibilidadText = "Cargando";

            } else {
              x.whole_background = '#4e5054';
              x.foreground_color = 'white';
              x.iconColor = 'assets/img/conector-' + x.tipo_conector.id + '-white.png';
              x.botonActivado = false;
              x.textBoton = 'No disponible';
              x.disponibilidadText = "No Disponible";
            }
          })

        }
      }
      this.ovb.unsubscribe();

      setTimeout(() => {
        this.getAlarmasMangueras();
      }, 5000);
    })
  }
  MangueraClicked(manguera) {

    if (manguera.estadoCarga == "Charging") {
      this.router.navigate(['/detalle-cargador'], {
        state: {
          cargadorData: this.cargador,
          is24Hours: this.is24Hours,
        }
      });
    } else {

      this.router.navigate(['/inicio-carga'], {
        state: {
          manguera,
        }
      });
    }
  }

  dismissModal(modal) {
    modal.dismiss().then(() => {
    });
  }
  onMapReady(map) {
    map.setOptions({
      zoomControl: 'true',
      zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
        style: google.maps.ZoomControlStyle.DEFAULT
      }
    });
  }
  openDetalleCargador() {
    this.router.navigate(['/detalle-cargador'], {
      state: {
        cargadorData: this.cargador,
        is24Hours: this.is24Hours,
      }
    });
  }

}
