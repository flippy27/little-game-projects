import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { LogoColbunComponent } from '../components/logo-colbun/logo-colbun.component';
import { HeaderComponent } from '../components/header/header.component';



@NgModule({
  declarations: [
    LogoColbunComponent,
    HeaderComponent,
  ],
  imports: [

    IonicModule,
    CommonModule,

  ],
  exports:[
    LogoColbunComponent,
    HeaderComponent,
  ]
})
export class SharedModuleModule { }
