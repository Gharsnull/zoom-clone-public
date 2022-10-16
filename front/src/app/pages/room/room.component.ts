import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/WebSocket/web-socket.service';
import { PeerService } from '../../services/Peer/peer.service';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from './models/user.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  roomName: string;
  userName: string;
  currentStream: MediaStream;
  currentPeerId: string;
  userList: UserModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private webSocketService: WebSocketService,
    private peerService: PeerService
  ) {
    this.roomName = this.route.snapshot.paramMap.get('id') ?? '';
  }

  ngOnInit(): void {
    if(!this.userName) {
      this.userName = prompt('Enter your username') ?? '';
    }
    this.initSocket();
    this.initPeer();
  }

  initPeer() {
    const { peer } = this.peerService;

    peer.on('open', async (id) => {
      const body = {
        idPeer: id,
        roomName: this.roomName,
        userName: this.userName,
      };
      this.currentPeerId = id;
      await this.checkMediaDevices(id);
      this.webSocketService.joinRoom(body);
    });

    peer.on('call', (callEnter) => {
      callEnter.answer(this.currentStream);
      callEnter.on('stream', (remoteStream) => {
        console.log(remoteStream)
        this.addVideoUser({
          userStream: remoteStream,
          idPeer: callEnter.peer,
          userName: callEnter.metadata.userName
        });
      });
    }, (err) => console.log('*** ERROR *** Peer call', err));


  }

  initSocket() {
    this.webSocketService.callbackEvent.subscribe(res => {
      const { idPeer, userName } = res.payload;
      if(res.name === 'new-user') {
        this.sendCall(idPeer, userName, this.currentStream);
      }

      if(res.name === 'bye-user') {
        this.deleteVideoUser(idPeer);
      }
    });
  }

  async checkMediaDevices(idPeer: string) {
    if (navigator && navigator.mediaDevices) {
      try {

        this.currentStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        if(idPeer) {
          this.addVideoUser({ userStream: this.currentStream, idPeer, userName: this.userName });
        }
      } catch (e) {
        console.log('*** ERROR *** No permissions', e);
      }
      return;
    }
    console.error('*** ERROR *** No media devices');
  }

  addVideoUser(stream: UserModel) {
    const index = this.userList.findIndex(x => x.idPeer === stream.idPeer);
    if(index >= 0) {
      this.userList[index] = stream ;
      return;
    }
    this.userList.push(stream);
  }

  deleteVideoUser(idPeer: string) {
    this.userList = this.userList.filter(x => x.idPeer !== idPeer);
  }

  sendCall(idPeer, userName, stream) {
    const newUserCall = this.peerService.peer.call(idPeer, stream, { metadata: {userName: this.userName}});

    if (!!newUserCall) {
      newUserCall.on('stream', (userStream) => {
        this.addVideoUser({ idPeer, userStream, userName: userName });
      });
    }
  }

  toggleMute(muted: boolean) {
    this.currentStream.getAudioTracks()[0].enabled = !muted;
  }
}
