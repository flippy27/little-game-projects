import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() headerTitle:string;
  @Input() backButton:boolean = true;
  @Input() sandwich:boolean = false;

  constructor() { }

  ngOnInit() {
    if(this.sandwich){
      this.backButton = false;
    }
  }

}
