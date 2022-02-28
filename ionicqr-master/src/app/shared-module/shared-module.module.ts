import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { LogoColbunComponent } from '../components/logo-colbun/logo-colbun.component';



@NgModule({
  declarations: [
    LogoColbunComponent,
  ],
  imports: [

    IonicModule,

  ],
  exports:[
    LogoColbunComponent
  ]
})
export class SharedModuleModule { }
