import { Injectable } from '@angular/core';
import Peer from 'peerjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeerService {
  peer: Peer;

  constructor() {

    this.peer = new Peer('', {
      host: environment.peerHost,
    });
  }
}
