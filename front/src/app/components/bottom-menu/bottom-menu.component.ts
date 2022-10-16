import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {MENU} from "./constants";
import { BtnMenu } from './models/menu.model';

@Component({
  selector: 'app-bottom-menu',
  templateUrl: './bottom-menu.component.html',
  styleUrls: ['./bottom-menu.component.scss']
})
export class BottomMenuComponent implements OnInit {

  menu = MENU;
  url: string;
  muted: boolean;

  @Output() muteEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
    this.url = location.href;
  }

  toggleMute() {
    this.muted = !this.muted;
    this.muteEvent.emit(this.muted);
  }

}
