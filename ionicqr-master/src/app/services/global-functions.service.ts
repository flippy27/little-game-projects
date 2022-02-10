import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

import { AddSubZone } from '../components/interfaces/enums/addSubZone.enum';
import { ReturnFormat } from '../components/interfaces/enums/returnFormat.enum';
import { AuthService } from './auth.service';
import { CargadorServiceService } from './cargador-service.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {
  navbarData = [];

  constructor(
    private auth: AuthService,
    private cargadorService: CargadorServiceService,

  ) { }

  formatearFechaFull = (fecha: string, conDesfase: AddSubZone, region_horaria: string, returnFormat: ReturnFormat) => {

    const d = new Date(fecha);
    if (region_horaria != "") {


      const tz = (moment.tz.zone(region_horaria).utcOffset(d.getTime())); // formato:  180 o 240
      const desfase = tz / 60 * 1;

      if (conDesfase == AddSubZone.Add) {

        d.setHours(d.getHours() + desfase);

      } else if (conDesfase == AddSubZone.Sub) {

        d.setHours(d.getHours() - desfase);
      } else if (conDesfase == AddSubZone.None) {
        //do nothing
      }
    }
    this.getDateFormattedString(returnFormat);


    const yyyy = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, '0'); //Enero es 0
    const dd = String(d.getDate()).padStart(2, '0');
    const HH = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    switch (returnFormat) {
      case ReturnFormat.yyyyMMdd_HHmmss:
        return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
        break;
      case ReturnFormat.yyyyddMM_HHmmss:
        return `${yyyy}-${dd}-${MM} ${HH}:${mm}:${ss}`
        break
      case ReturnFormat.MMddYYYY_HHmmss:
        return `${MM}-${dd}-${yyyy} ${HH}:${mm}:${ss}`
        break;
      case ReturnFormat.ddMMyyyy_HHmmss:
        return `${dd}-${MM}-${yyyy} ${HH}:${mm}:${ss}`
        break;
      case ReturnFormat.MMdd_HHmmssm:
        return `${MM}-${dd} ${HH}:${mm}:${ss}`
        break
      //CORTOS
      case ReturnFormat.ddMMyyyy:
        return `${dd}-${MM}-${yyyy}`
        break
      case ReturnFormat.HHmmss:
        return `${HH}:${mm}:${ss}`
        break
      case ReturnFormat.MMddyyyy:
        return `${MM}-${dd}-${yyyy}`
        break
      case ReturnFormat.yyyyMMdd:
        return `${yyyy}-${MM}-${dd}`
        break
      case ReturnFormat.MMyyyy:
        return `${MM}-${yyyy}`
        break
      default:
        return '';
    }
  }

  async GetEmpresa() {
    let empresaSelectedID = this.auth.empresaAccess();
    return new Promise((res, rej) => {
      this.cargadorService.getEmpresa(empresaSelectedID).subscribe((e) => {
        res(e);
      })
    });
  }
  getDateFormattedString(returnFormat: ReturnFormat) {
    for (let i = 0; i < returnFormat.toString().length; i++) {
      const element = returnFormat.toString()[i];


    }
  }
  groupBy(xs, key) {
    let temp_dic = {};
    temp_dic = xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
    let return_array = [];
    for (const [key, value] of Object.entries(temp_dic)) {
      let item = {
        key,
        data: value,
      }
      return_array.push(item);
    }
    return return_array;
  };


  getInnerWindowSize(w, h) {
    if (window.innerWidth > 1000) {
      return [w + 'px', h + 'px'];
    } else {
      return ['100%', '100%'];
    }
  }
}
