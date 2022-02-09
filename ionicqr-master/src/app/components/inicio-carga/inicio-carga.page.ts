import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio-carga',
  templateUrl: './inicio-carga.page.html',
  styleUrls: ['./inicio-carga.page.scss'],
})
export class InicioCargaPage implements OnInit {
  manguera;
  conectorImg;
  constructor() { }

  ngOnInit() {
    this.manguera = history.state.manguera;
    console.log('manguera',this.manguera);
    this.conectorImg = 'assets/img/conector-' + this.manguera.tipo_conector.id + '.png'
  }

}
