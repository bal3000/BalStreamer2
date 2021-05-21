import { webSocket } from 'rxjs/webSocket';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Chromecast } from '../models/chromecast';

@Injectable({
  providedIn: 'root',
})
export class ChromecastService {
  chromecasts$ = new BehaviorSubject<Chromecast>(null)
  private chromecastWs = webSocket<Chromecast>(
    'ws://localhost:8080/chromecasts'
  );

  getChromecasts(): BehaviorSubject<Chromecast> {
    return new BehaviorSubject(this.chromecastWs.);
  }
}
