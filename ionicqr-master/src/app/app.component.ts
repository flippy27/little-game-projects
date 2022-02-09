import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private menu: MenuController,
    private auth:AuthService,
    private router:Router,
    ) {}
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
  logout(){
    this.auth.logout();
    this.router.navigateByUrl('');
  }

}
