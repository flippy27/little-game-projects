import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformacionCargadorPageRoutingModule } from './informacion-cargador-routing.module';

import { InformacionCargadorPage } from './informacion-cargador.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformacionCargadorPageRoutingModule
  ],
  declarations: [InformacionCargadorPage]
})
export class InformacionCargadorPageModule {}
