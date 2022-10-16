import { EventEmitter, Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { EVENTS } from './web-socket.constants';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  callbackEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private socket: Socket) {
    this.listener();
  }

  listener() {
    EVENTS.forEach((eventName) => {
      this.socket.on(eventName, (payload) => this.callbackEvent.emit({
        name: eventName,
        payload
      }));
    });
  }

  joinRoom(payload) {
    this.socket.emit('join', payload);
  }
}
