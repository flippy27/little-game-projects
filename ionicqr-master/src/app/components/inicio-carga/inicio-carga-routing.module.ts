import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioCargaPage } from './inicio-carga.page';

const routes: Routes = [
  {
    path: '',
    component: InicioCargaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioCargaPageRoutingModule {}
