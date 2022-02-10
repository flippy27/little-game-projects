import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleCargadorPage } from './detalle-cargador.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleCargadorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleCargadorPageRoutingModule {}
