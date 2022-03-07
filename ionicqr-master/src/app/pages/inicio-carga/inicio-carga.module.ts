import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioCargaPageRoutingModule } from './inicio-carga-routing.module';

import { InicioCargaPage } from './inicio-carga.page';
import { SharedModuleModule } from '../../shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioCargaPageRoutingModule,
    SharedModuleModule,
  ],
  declarations: [
    InicioCargaPage,
    
  ]
})
export class InicioCargaPageModule {}
