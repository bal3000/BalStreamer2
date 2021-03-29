import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { AppRoutingModule } from './app-routing.module';

import { ChromecastState } from './state/chromecast.state';

import { AppShellModule } from './app-shell/app-shell.module';
import { AppComponent } from './app.component';
import { ChromecastService } from './services/chromecast.service';
import { environment } from '../environments/environment';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent],
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
  providers: [ChromecastService],
  bootstrap: [AppComponent],
})
export class AppModule {}
