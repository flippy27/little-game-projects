import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}
  ionViewDidEnter() {
    document.addEventListener("backbutton",function(e) {
      console.log("disable back button")
    }, false);
  }
}
