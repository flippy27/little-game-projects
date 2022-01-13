import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserActionSelectionPage } from './user-action-selection.page';

const routes: Routes = [
  {
    path: '',
    component: UserActionSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserActionSelectionPageRoutingModule {}
