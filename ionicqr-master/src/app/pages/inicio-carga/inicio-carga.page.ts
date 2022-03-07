import { Component, OnInit } from '@angular/core';
import { CargadorServiceService } from '../../services/cargador-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { GlobalFunctionsService } from '../../services/global-functions.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-carga',
  templateUrl: './inicio-carga.page.html',
  styleUrls: ['./inicio-carga.page.scss'],
})
export class InicioCargaPage implements OnInit {
  manguera;
  cargador;
  conectorImg;
  EstadoInicioCarga: string;
  empresa;

  botonInicioActivado: boolean;
  cargaSeEstaIniciando: boolean;

  estadoPreCarga: string;
  // TOKEN
  tokenPayload;
  user_id;

  //COMANDO
  configComandoOcpp;

  constructor(
    private cService: CargadorServiceService,
    private jwtHelper: JwtHelperService,
    private globalFunc: GlobalFunctionsService,
    private cargadorService: CargadorServiceService,
    private nav: NavController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.cargaSeEstaIniciando = false;
    const token: any = localStorage.getItem('access_token');
    this.tokenPayload = this.jwtHelper.decodeToken(token);
    this.user_id = this.tokenPayload.user_id;

    this.manguera = history.state.manguera;
    this.cargador = history.state.cargadorData;
    this.conectorImg = 'assets/img/conector-' + this.manguera.tipo_conector.id + '.png';
    this.cService.getConfigComandosOcpp({ tipos_modelos_equipos_id: this.cargador.tipos_modelos_equipos_id, tipos_comandos_ocpp_id: 1 }).subscribe(result => {
      let empresaSelectedID = this.tokenPayload.empresas_id
      this.cargadorService.getEmpresa(empresaSelectedID).subscribe(x => {
        this.configComandoOcpp = result;
        console.log('config', result);
        console.log('empres', x);
        this.empresa = x;

        this.getMangueraPreparing();
      })
    })
    this.botonInicioActivado = true;
  }
  ionViewDidEnter() {
    document.addEventListener("backbutton", function (e) {
      console.log("disable back button")
    }, false);
  }
  getMangueraPreparing() {
    this.cService.getDatoMangueraUnica({ mangueras_id: this.manguera.id }).subscribe(x => {
      if (x[0].estado == "Preparing") {
        this.estadoPreCarga = "Manguera conectada esperando Inicio de carga...";
        this.botonInicioActivado = false;
      } else {
        this.estadoPreCarga = "Esperando manguera...";
        setTimeout(() => {
          this.getMangueraPreparing();
        }, 1000);
      }

    })
  }
  botonInicio() {
    this.cargaSeEstaIniciando = true;
    this.SendRealCharge();
  }
  getMangueraCharging() {
    this.cService.getDatoMangueraUnica({ mangueras_id: this.manguera.id }).subscribe(x => {
      if (x[0].estado == "Charging") {
        this.EstadoInicioCarga = "Esperando transaction ID";
        this.getMangueraTransactionID();
      } else {
        setTimeout(() => {
          this.getMangueraCharging();
        }, 1000);
      }
    })
  }
  getMangueraTransactionID() {
    let tempBool = false;
    this.cService.getAllUserTransactions({ usuarios_id: this.user_id }).subscribe(x => {
      this.EstadoInicioCarga = "Ultimos pasos :D";
      x.forEach(y => {
        //SE CHEQUEA QUE EL TRANSACTION ID YA HAYA LLEGADO Y QUE EL ESTADO SEA 1 (es decir ya cargando)
        if (y.transactionId != null && y.estado_actual == 1) {
          console.log("tengo todos los datos", x);
          this.cargador.mangueras.forEach(x=>{
            x.estadoCarga = "Charging";
          })
          this.router.navigate(['detalle-cargador'], {
            state: {
              cargadorData: this.cargador,
              is24Hours: false,
            }
          });
          tempBool = true;
        }
        
      })
      if(!tempBool){
        setTimeout(() => {
          this.getMangueraTransactionID();
        }, 3000);
      }
    },err=>{
      console.log('error ',err);
      
    })
  }
  SendRealCharge() {


    let comando;

    //ESTO ES INICIAR CARGA
    console.log('ccopp', this.configComandoOcpp);

    let idTag = this.configComandoOcpp.find(x => { return x.nombre_parametro == "idTag" })
    //let idtt = JSON.parse(idTag.valor_parametro).find(x=>{return x.numero_manguera == this.selectedManguera.numero_manguera});
    let idtagsmangueras = [];
    let vals = idTag.valor_parametro.split(',');
    let tagids = [];
    vals.forEach(x => {

      let temp = x.toString().split(':');

      tagids.push({ nmanguera: temp[0], value: temp[1] });
    })
    let tag = tagids.find(x => { return x.nmanguera == this.manguera.numero_manguera })
    comando = {
      cargador: this.cargador,
      manguera_uno: this.cargador.mangueras[0].id,
      manguera_dos: this.cargador.mangueras[1].id,
      empresaID: this.empresa.id,
      equipo: this.cargador.nombre,
      idTag: tag.value,
      userID: this.user_id,
      connectorId: this.manguera.id,

      chargingProfileId: this.configComandoOcpp.find(x => { return x.nombre_parametro == "chargingProfileId" }).valor_parametro,
      transactionID: this.configComandoOcpp.find(x => { return x.nombre_parametro == "chargingProfileId" }).valor_parametro,
      stackLevel: this.configComandoOcpp.find(x => { return x.nombre_parametro == "stackLevel" }).valor_parametro,
      chargingProfilePurpose: this.configComandoOcpp.find(x => { return x.nombre_parametro == "chargingProfilePurpose" }).valor_parametro,
      chargingProfileKind: this.configComandoOcpp.find(x => { return x.nombre_parametro == "chargingProfileKind" }).valor_parametro,
      startScheduleEna: this.configComandoOcpp.find(x => { return x.nombre_parametro == "startScheduleEna" }).valor_parametro,
      chargingRateUnit: this.configComandoOcpp.find(x => { return x.nombre_parametro == "chargingRateUnit" }).valor_parametro,
    }
    console.log('comando', comando);

    this.getMangueraCharging();
    this.cService.envioComandoOcppStart(comando).subscribe(val => {
      //this.mensajeError = val.mensaje;

      if (val.mensaje === 'correcto') {
        console.log('correctoooo');
      } else {

        console.log('error');

      }

      //this.cerrarConfirmaDialog();
    }, err => {

    });


  }
}
