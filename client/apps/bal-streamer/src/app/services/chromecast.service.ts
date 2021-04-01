import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chromecast } from '../models/chromecast';

@Injectable({
  providedIn: 'root',
})
export class ChromecastService {
  private chromecastWs: WebSocketSubject<Chromecast> = webSocket(
    'ws://localhost:8080/chromecasts'
  );

  getChromecasts(): Observable<Chromecast> {
    return this.chromecastWs.asObservable();
  }
}
