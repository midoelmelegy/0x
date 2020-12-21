import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  showMenu: boolean;

  constructor() { }

  ngOnInit(): void {
    this.showMenu = false;
  }

  toggleShowMenu() {
    this.showMenu = ! this.showMenu;
  }

}
