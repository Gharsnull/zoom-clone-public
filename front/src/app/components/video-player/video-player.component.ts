import {Component, Input, OnInit} from '@angular/core';
import { UserModel } from '../../pages/room/models/user.model';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {
  @Input() user: UserModel;
  @Input() currentPeerId: string;

  constructor() { }

  ngOnInit(): void {
  }



}
