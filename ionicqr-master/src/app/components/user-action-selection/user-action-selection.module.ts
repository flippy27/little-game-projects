import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserActionSelectionPageRoutingModule } from './user-action-selection-routing.module';

import { UserActionSelectionPage } from './user-action-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserActionSelectionPageRoutingModule
  ],
  declarations: [UserActionSelectionPage]
})
export class UserActionSelectionPageModule {}
