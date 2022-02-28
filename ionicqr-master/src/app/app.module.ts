import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { globalApi } from './global';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage-angular';
import { StorageService } from './services/storage.service';
import { Drivers } from '@ionic/storage';
import { ListaCargadoresComponent } from './components/lista-cargadores/lista-cargadores.component';
import { SharedModuleModule } from './shared-module/shared-module.module';


export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [
    AppComponent, 
    ListaCargadoresComponent,
    
  ],
  entryComponents: [
    ListaCargadoresComponent,

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot({hardwareBackButton: false}),
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    SharedModuleModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [globalApi.uri],
        disallowedRoutes: [globalApi.uri + '/auth/login']
      }
    }),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    }),

  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner,
    StorageService,
    IonicStorageModule,
    ScreenOrientation,

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
