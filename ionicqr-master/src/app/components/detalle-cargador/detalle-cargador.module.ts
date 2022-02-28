import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleCargadorPageRoutingModule } from './detalle-cargador-routing.module';

import { DetalleCargadorPage } from './detalle-cargador.page';
import { SharedModuleModule } from '../../shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleCargadorPageRoutingModule,
    SharedModuleModule,
  ],
  declarations: [
    DetalleCargadorPage,
  ]
})
export class DetalleCargadorPageModule {}
