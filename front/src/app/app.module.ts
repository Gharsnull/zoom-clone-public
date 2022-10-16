import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { RoomComponent } from './pages/room/room.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { BottomMenuComponent } from './components/bottom-menu/bottom-menu.component';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { ClipboardModule } from 'ngx-clipboard';
import { environment } from '../environments/environment';

const config: SocketIoConfig = { url: environment.serverURl, options: { withCredentials: '*' } };

@NgModule ({
  declarations: [
    AppComponent,
    HomeComponent,
    RoomComponent,
    VideoPlayerComponent,
    BottomMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClipboardModule,
    SocketIoModule.forRoot (config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
