import { Component, OnInit, ViewChild } from '@angular/core';
import { CargadorServiceService } from 'src/app/services/cargador-service.service';
import * as moment from 'moment-timezone';
import { GlobalFunctionsService } from '../../services/global-functions.service';
import { AddSubZone } from '../../components/interfaces/enums/addSubZone.enum';
import { ReturnFormat } from '../../components/interfaces/enums/returnFormat.enum';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4lang_es_ES from "@amcharts/amcharts4/lang/es_ES";
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-cargador',
  templateUrl: './detalle-cargador.page.html',
  styleUrls: ['./detalle-cargador.page.scss'],
})
export class DetalleCargadorPage implements OnInit {
  cargador;

  isOn: boolean;
  isOnText: string;

  conectores = [
    { n_conector: 1, estado: false },
    { n_conector: 2, estado: false }
  ]

  selectedConector;
  cargadorDetenidoTemp: boolean;
  chart;

  mangueraSeleccionada;
  mangueraSeleccionadaConectorImg;
  ultimoDatoMangueraSeleccionada;

  loading;
  dataSourceCargadores: any;

  eair;
  timer;
  firstTime = true;
  pieChart;
  is24Hour;
  horaInicio;
  socInicio;
  socFin;

  //@ViewChild('cargadoresFinalPaginator') cargadoresFinalPaginator: MatPaginator;
  @ViewChild('conectorSelect') conectorSelect;
  @ViewChild('espereDetencion') espereDetencionDialog;
  @ViewChild('informeFinalCarga') informeFinalCargaDialog;
  columnasDataCargadores: string[] = ['cargador', 'manguera', 'dia', 'horaInicio', 'horaFin', 'minutosCarga', 'socInicio', 'socFin', 'kWh', 'bus'];

  @ViewChild('resumenModal') resumenModal;


  subscriptions = [];


  dataCargadores = [];

  ultimaData;

  textoDetenerCarga;
  colorFondoDetenerCarga;
  timerFecha;
  empresa;

  haySOC: boolean;
  tid;
  constructor(
    private cargadorService: CargadorServiceService,
    private globalFunc: GlobalFunctionsService,
    private modalCtrl:ModalController,

  ) { }
  ionViewDidEnter() {
    document.addEventListener("backbutton", function (e) {
      console.log("disable back button")
    }, false);
  }
  ngOnInit() {
    this.loading = true;
    this.mangueraSeleccionada = null;
    this.isOnText = "Iniciar";
    this.isOn = false;
    this.cargador = history.state.cargadorData;
    this.is24Hour = history.state.is24Hours;
    console.log('data arrive',history.state.is24Hours);
    
    if (this.is24Hour) {
      this.textoDetenerCarga = 'Resumen Carga';
      this.colorFondoDetenerCarga = '#f0ce2d'
    } else {
      this.textoDetenerCarga = 'Detener Carga';
      this.colorFondoDetenerCarga = '#d99034';
    }
    this.globalFunc.GetEmpresa().then(x => {
      this.empresa = x;
      this.getDatosManguera();
      this.startTimer();
    })
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((x) => {
      x.unsubscribe();
    })
  }
  getDatosManguera() {

    let dataSend = { mangueras: this.cargador.mangueras };
    var obvDatosMangueras = this.cargadorService.datosMangueras(dataSend).subscribe(res => {

      this.subscriptions.push(obvDatosMangueras);
      let mangueraSend;
      let tempDate = res[0].created_at;
      mangueraSend = res[0];

      res.forEach(x => {
        if (x.created_at > tempDate) {
          mangueraSend = x;
        }
      })

      this.ultimoDatoMangueraSeleccionada = mangueraSend;
      this.ultimoDatoMangueraSeleccionada.maximo = 100;


      //this.creaPieChart(this.ultimoDatoMangueraSeleccionada);
      let ff = this.globalFunc.formatearFechaFull(new Date().toString(), AddSubZone.Add, this.empresa.region_horaria, ReturnFormat.yyyyMMdd_HHmmss);
      obvDatosMangueras.unsubscribe();
      var obvDAM = this.cargadorService.datosAlarmasMangueras({ mangueras_id: this.ultimoDatoMangueraSeleccionada.mangueras_id, fechaIni: ff, hours: this.is24Hour ? 24 : 2 }).subscribe(res => {
        console.log('dalarmasmangueras', res);

        this.subscriptions.push(obvDAM);
        let ChargeStarted;

        for (let i = 0; i < res.length; i++) {
          const element = res[i];
          if (element.estado == "Charging") {
            ChargeStarted = element;
            if (i < res.lenght) {
              if (res[i + 1].estado == "Charging") {
                ChargeStarted = res[i + 1];
                break;
              }
            }
            break;
          }
        }

        let ChargeEnded;
        if (this.is24Hour) {
          for (let i = 0; i < res.length; i++) {
            const element = res[i];
            if (element.estado == "Charging") {
              if (res[i - 1] != null) {
                ChargeEnded = res[i - 1];
              } else {
                ChargeEnded = {

                  created_at: this.ultimoDatoMangueraSeleccionada.created_at,
                }
              }
              break;
            }
          }
        }
        let duration;

        //DURATION
        if (this.is24Hour) {
          duration = Math.abs(moment(ChargeStarted.created_at).diff(moment(ChargeEnded.created_at)));
        } else {
          duration = moment().diff(moment(this.globalFunc.formatearFechaFull(ChargeStarted.created_at, AddSubZone.Sub, this.empresa.region_horaria, ReturnFormat.yyyyMMdd_HHmmss)));
        }

        this.timerFecha = this.globalFunc.formatearFechaFull(ChargeStarted.created_at, AddSubZone.Sub, this.empresa.region_horaria, ReturnFormat.ddMMyyyy_HHmmss);
        let time = this.msToTime(duration);
        this.timer = time;

        if (!this.is24Hour && this.firstTime) {
          clearTimeout(this.tempTimeTimeout);
          this.temptime(duration);
        }

        let fini2 = moment(ChargeStarted.created_at).add(+1, 'hour').format('YYYY-MM-DD HH:mm:ss');
        obvDAM.unsubscribe();
        var obvDMC = this.cargadorService.datosMangueraColbun({ mangueras_id: this.ultimoDatoMangueraSeleccionada.mangueras_id, fechaIni: fini2, hours: this.is24Hour ? 24 : 2 }).subscribe(val => {
          let newValZero = [];            


          let tidManguera;
          if (val[0][0].mangueras_id == this.ultimoDatoMangueraSeleccionada.mangueras_id) {
            //tidManguera = val[0][0];
            tidManguera = val[0].find(x => { return x.transactionId != 0 })
          } else {
            tidManguera = val[1].find(x => { return x.transactionId != 0 });
          }
          this.tid = tidManguera.transactionId;
          console.log(this.tid);

          //GET TRANSSACTION DATA
          this.cargadorService.getDatosOcppTransactionID({ transaction_id: tidManguera.transactionId }).subscribe(result => {
            

            //FILTER SOC
            let filteredSoc = result.filter(x => { return x.tipos_datos_id == 38 });
            if (filteredSoc.length == 0) {
              this.haySOC = false;
            } else {
              this.haySOC = true;
              this.socInicio = filteredSoc[filteredSoc.length - 1].valor;
              this.socFin = filteredSoc[0].valor;
            }
            console.log('fsoc', filteredSoc);


            val[0].forEach(x => {
              if (new Date(x.created_at) > new Date(ChargeStarted.created_at)) {
                newValZero.push(x);
              }
            })
            let newValOne = [];
            val[1].forEach(x => {
              if (new Date(x.created_at) > new Date(ChargeStarted.created_at)) {
                newValOne.push(x);
              }
            })
            this.subscriptions.push(obvDMC);

            let enerty_active_import_register = newValZero;
            this.eair = enerty_active_import_register[0].valor - enerty_active_import_register[enerty_active_import_register.length - 1].valor;

            this.eair = this.eair.toFixed(1);
            this.mangueraSeleccionada = this.cargador.mangueras.find(x => { return x.id == mangueraSend.mangueras_id });
            this.mangueraSeleccionadaConectorImg = "/assets/img/conector-" + this.mangueraSeleccionada.tipo_conector.id + ".png";
            newValOne.forEach(x => {

              x.fecha_grafico = this.globalFunc.formatearFechaFull(x.created_at, AddSubZone.Sub, this.empresa.region_horaria, ReturnFormat.yyyyMMdd_HHmmss);
              x.fecha_grafico = new Date(x.fecha_grafico);
            })
            
            let ssoc = this.haySOC ? this.ultimoDatoMangueraSeleccionada.soc : '-';
            let socInicial = this.haySOC ? this.socInicio : '-';
            this.ultimaData = {
              conector: this.mangueraSeleccionada,
              energyActiveImportRegister: this.eair,
              tiempo: this.timer,
              soc: ssoc,
              socInicial,
            }
            this.loading = false;

            this.creaChartUnico(newValOne, this.firstTime);
            console.log('ultima data',this.ultimaData);
            
            if (this.ultimaData.conector.estadoCarga != "Charging") {
              this.is24Hour = true;
              //this.updateBotonDetenerCarga();
              this.textoDetenerCarga = "Resumen Carga";
              clearTimeout(this.tempTimeTimeout);
              //this.mostrarCuadroDetalleFinal();
              return;
            }
            this.firstTime = false;
            this.startTimer();
            obvDMC.unsubscribe();
            setTimeout(() => {
              this.getDatosManguera();
            }, 5000);
          })
        })
      })
    })
  }
  time: number = 0;
  interval;
  startTimer() {
    this.interval = setInterval(() => {
      if (this.time == 0) {
        this.time++;
      } else {
        this.time = 0;
      }
    }, 1000)
  }
  msToTime(duration) {
    let seconds: any = Math.floor((duration / 1000) % 60);
    let minutes: any = Math.floor((duration / (1000 * 60)) % 60);
    let hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
  }
  tempTimeTimeout;
  temptime(dur) {

    let time = this.msToTime(dur += 1000);
    this.timer = time;
    this.tempTimeTimeout = setTimeout(() => {

      this.temptime(dur);
    }, 1000);

  }
  dismissModal(modal) {
    modal.dismiss().then(() => {
    });
  }
 
  donothing() {

  }

  detenerCarga() {
    console.log('llegue hasta antes del 24 h');
    
    if (this.is24Hour) {
      console.log('entre al 24 hours',this.is24Hour);
      
      return;
    }
    let equipo = this.cargador.nombre;
    let manguera = this.mangueraSeleccionada;
    
    let dataSend = {
      equipo,
      pistola: manguera.numero_manguera,
      manguera_id: manguera.id,
      tid: this.tid,
    }
    console.log('pase el 24h  datasend',dataSend);

    this.cargadorService.remoteStopNuevo(dataSend).subscribe(res => {
      console.log(res);
      if (res.mensaje === "correcto") {

        this.is24Hour = true;
        this.chequearEstado();
      } else {
        console.error('error deteniendo carga');
        
        
      }

    })
  }
  chequearEstado() {
    this.cargadorService.ultimasalarmasMangueras([{ mangueras_ids: this.mangueraSeleccionada.id }]).subscribe(x => {
      if (x.estado != "Charging" && x.estado != "Offline") {
        this.mostrarCuadroDetalleFinal();
      } else {
        this.chequearEstado();
      }
    })
  }
  async mostrarCuadroDetalleFinal() {
    const modal = await this.modalCtrl.create({
      component: this.resumenModal,
    });

    await modal.present();
  }

  creaChartUnico(source, reload) {


    if (!reload) {
      this.chart.data = source;
      return;
    }
    let nombre;

    const chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.language.locale = am4lang_es_ES;

    const title = chart.titles.create();
    title.text = "";
    title.fontSize = 25;
    title.marginBottom = 30;
    chart.data = source;
    chart.colors.step = 2; // Increase contrast by taking evey second color

    // Create axes
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.baseInterval = {
      "timeUnit": "second",
      "count": 1
    };
    dateAxis.strictMinMax = true;
    function createAxisAndSeries(field, name, opposite, bullet, max) {

      const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      let series;
      series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = field;
      series.dataFields.dateX = "fecha_grafico";

      series.strokeWidth = 1;
      series.yAxis = valueAxis;
      series.name = name;
      series.tooltipText = "{name}: \n [bold]{valueY}[/]";
      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 2;
      valueAxis.renderer.line.stroke = series.stroke;
      valueAxis.renderer.labels.template.fill = series.stroke;
      valueAxis.renderer.opposite = opposite;
      valueAxis.renderer.grid.template.disabled = true;
      // valueAxis.tooltip.disabled = true;

      const scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;


      series.tooltip.background.fill = am4core.color("#4e5054");
    }

    createAxisAndSeries("valor", nombre, false, "circle", "");
    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.scrollbarX.startGrip.disabled = true;
    chart.scrollbarX.endGrip.disabled = true;
    chart.scrollbarX.disabled = true;


    const watermark = new am4core.Image();
    watermark.href = "/assets/img/dhemax_chico.svg";
    chart.plotContainer.children.push(watermark);
    watermark.align = "right";
    watermark.valign = "bottom";
    watermark.opacity = 0.2;
    watermark.marginRight = 10;
    watermark.marginBottom = 5;
    watermark.height = 120;
    watermark.width = 120;

    this.chart = chart;

  }
}
