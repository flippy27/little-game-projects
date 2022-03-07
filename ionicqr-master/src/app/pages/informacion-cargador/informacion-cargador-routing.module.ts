import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformacionCargadorPage } from './informacion-cargador.page';

const routes: Routes = [
  {
    path: '',
    component: InformacionCargadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformacionCargadorPageRoutingModule {}
