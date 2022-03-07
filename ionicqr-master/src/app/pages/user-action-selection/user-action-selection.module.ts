import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserActionSelectionPageRoutingModule } from './user-action-selection-routing.module';

import { UserActionSelectionPage } from './user-action-selection.page';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { SharedModuleModule } from '../../shared-module/shared-module.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserActionSelectionPageRoutingModule,
    SharedModuleModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDouJncyRWt29-PSe_RTjKXOsFeOOLJDmM',
      libraries: ['places']
    }),
    AgmDirectionModule,
  ],
  declarations: [UserActionSelectionPage]
})
export class UserActionSelectionPageModule {}
