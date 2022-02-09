import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioCargaPageRoutingModule } from './inicio-carga-routing.module';

import { InicioCargaPage } from './inicio-carga.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioCargaPageRoutingModule
  ],
  declarations: [InicioCargaPage]
})
export class InicioCargaPageModule {}
