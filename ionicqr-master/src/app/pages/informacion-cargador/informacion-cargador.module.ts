import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformacionCargadorPageRoutingModule } from './informacion-cargador-routing.module';

import { InformacionCargadorPage } from './informacion-cargador.page';
import { AgmCoreModule } from '@agm/core';
import { LogoColbunComponent } from '../../components/logo-colbun/logo-colbun.component';
import { SharedModuleModule } from '../../shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformacionCargadorPageRoutingModule,
    SharedModuleModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDouJncyRWt29-PSe_RTjKXOsFeOOLJDmM',
      libraries: ['places']
  }),
  ],
  declarations: [
    InformacionCargadorPage,
  ]
})
export class InformacionCargadorPageModule {}
