import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'user-action-selection',
    loadChildren: () => import('./components/user-action-selection/user-action-selection.module').then( m => m.UserActionSelectionPageModule)
  },
  {
    path: 'qr-scan',
    loadChildren: () => import('./components/qr-scan/qr-scan.module').then( m => m.QrScanPageModule)
  },
  {
    path: 'informacion-cargador',
    loadChildren: () => import('./components/informacion-cargador/informacion-cargador.module').then( m => m.InformacionCargadorPageModule)
  },
  {
    path: 'inicio-carga',
    loadChildren: () => import('./components/inicio-carga/inicio-carga.module').then( m => m.InicioCargaPageModule)
  },
  {
    path: 'detalle-cargador',
    loadChildren: () => import('./components/detalle-cargador/detalle-cargador.module').then( m => m.DetalleCargadorPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
