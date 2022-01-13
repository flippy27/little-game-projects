import { Component, OnInit } from '@angular/core';
import { Route, Router, RouteReuseStrategy } from '@angular/router';
import { CargadorServiceService } from '../../services/cargador-service.service';
import { AuthService } from '../../services/auth.service';

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
  constructor(
    private cargadorService:CargadorServiceService,
    private auth:AuthService,
  ) { }

  ngOnInit() {
    this.cargador = history.state.data;
    let token = localStorage.getItem('access_token');
    let tknInfo = this.auth.jwtHelper.decodeToken(token);
    console.log('tokeninfo informacion',tknInfo);
    
    this.getAlarmasMangueras();
  }
  getAlarmasMangueras() {
    this.ovb = this.cargadorService.ultimasalarmasMangueras({ manguera_uno: this.cargador.mangueras[0].id, manguera_dos: this.cargador.mangueras[1].id }).subscribe(res => {
      this.alarmasManguera = res;

      if (this.alarmasManguera[0] && this.alarmasManguera[1]) {
        this.cargador.mangueras.forEach(x => {
          let tempma = this.alarmasManguera.find(y => { return y.mangueras_id == x.id });
          x.estadoParaColor = tempma.estado;
        })
        let m1 = this.cargador.mangueras.find(x => { return x.numero_manguera == 1 });
        let m2 = this.cargador.mangueras.find(x => { return x.numero_manguera == 2 });
        let m11 = this.alarmasManguera.find(x => { return x.mangueras_id == m1.id });
        let m22 = this.alarmasManguera.find(x => { return x.mangueras_id == m2.id });

        if (m11.estado == "Charging" && m22.estado == "Charging") {
          this.cargadorImg = "/assets/img/cargador-azul-azul.png";
          this.btnCargaActualClass = "boton-carga-actual";
          this.btnCargaActualActivated = true;
          this.is24Hours = false;
          this.textoBotonCargaActual = 'Carga Actual';
          m1.whole_background = '#4a72b2';
          m2.whole_background = '#4a72b2';
          m1.foreground_color = 'white';
          m2.foreground_color = 'white';
          m1.iconColor = 'assets/img/conector-' + m1.tipo_conector.id + '-white.png';
          m2.iconColor = 'assets/img/conector-' + m2.tipo_conector.id + '-white.png';
          m1.botonActivado = true;
          m2.botonActivado = true;
        } else if (m11.estado != "Charging" && m22.estado != "Charging") {
          this.cargadorImg = "/assets/img/cargador-verde-verde.png";
          this.btnCargaActualClass = "boton-carga-actual";
          this.btnCargaActualActivated = true;
          this.is24Hours = true;
          this.textoBotonCargaActual = 'Última Carga';
          m1.whole_background = '#85af37';
          m2.whole_background = '#85af37';
          m1.foreground_color = 'white';
          m2.foreground_color = 'white';
          m1.iconColor = 'assets/img/conector-' + m1.tipo_conector.id + '-white.png';
          m2.iconColor = 'assets/img/conector-' + m2.tipo_conector.id + '-white.png';
          m1.botonActivado = true;
          m2.botonActivado = true;
          m1.textBoton = 'Conecte manguera y presione para iniciar';
          m2.textBoton = 'Conecte manguera y presione para iniciar';

        } else if (m11.estado == "Charging" && m22.estado != "Charging") {
          this.cargadorImg = "/assets/img/cargador-azul-verde.png";
          this.btnCargaActualClass = "boton-carga-actual";
          this.btnCargaActualActivated = true;
          this.is24Hours = false;
          this.textoBotonCargaActual = 'Carga Actual';
          m1.whole_background = '#4a72b2';
          m2.whole_background = 'white';
          m1.foreground_color = 'white';
          m2.foreground_color = '#4e5054';
          m1.iconColor = 'assets/img/conector-' + m1.tipo_conector.id + '-white.png';
          m2.iconColor = 'assets/img/conector-' + m2.tipo_conector.id + '.png';
          m1.botonActivado = true;
          m2.botonActivado = false;
          m1.textBoton = 'Cargando';
          m2.textBoton = 'No disponible';

        } else if (m11.estado != "Charging" && m22.estado == "Charging") {
          this.cargadorImg = "/assets/img/cargador-verde-azul.png";
          this.btnCargaActualClass = "boton-carga-actual";
          this.btnCargaActualActivated = true;
          this.is24Hours = false;
          this.textoBotonCargaActual = 'Carga Actual';
          m1.whole_background = 'white';
          m2.whole_background = '#4a72b2';
          m1.foreground_color = '#4e5054';
          m2.foreground_color = 'white';
          m1.iconColor = 'assets/img/conector-' + m1.tipo_conector.id + '.png';
          m2.iconColor = 'assets/img/conector-' + m2.tipo_conector.id + '-white.png';
          m1.botonActivado = false;
          m2.botonActivado = true;
          m1.textBoton = 'No disponible';
          m2.textBoton = 'Cargando';
          console.log(m1,m2);
          
        }
      }
      this.ovb.unsubscribe();

      setTimeout(() => {
        this.getAlarmasMangueras();
      }, 5000);
    })
  }

}
