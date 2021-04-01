import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { AppRoutingModule } from './app-routing.module';

import { ChromecastState } from './state/chromecast.state';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { CastService } from './services/cast.service';
import { LivestreamingService } from './services/livestreaming.service';
import { ChromecastService } from './services/chromecast.service';
import { AppShellModule } from './app-shell/app-shell.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AppShellModule,
    NgxsModule.forRoot([ChromecastState], {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }),
  ],
  providers: [CastService, ChromecastService, LivestreamingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
