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
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'user-action-selection',
    loadChildren: () => import('./pages/user-action-selection/user-action-selection.module').then( m => m.UserActionSelectionPageModule)
  },
  {
    path: 'informacion-cargador',
    loadChildren: () => import('./pages/informacion-cargador/informacion-cargador.module').then( m => m.InformacionCargadorPageModule)
  },
  {
    path: 'inicio-carga',
    loadChildren: () => import('./pages/inicio-carga/inicio-carga.module').then( m => m.InicioCargaPageModule)
  },
  {
    path: 'detalle-cargador',
    loadChildren: () => import('./pages/detalle-cargador/detalle-cargador.module').then( m => m.DetalleCargadorPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
