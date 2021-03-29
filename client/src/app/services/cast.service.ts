import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CastService {
  private readonly castUrl = 'http://localhost:8080/api/cast';

  constructor(private readonly http: HttpClient) {}

  castStream(chromecast: string, streamURL: string): Observable<any> {
    return this.http.post(`${this.castUrl}`, { chromecast, streamURL });
  }

  stopStream(chromecast: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: {
        chromecast,
        stopDateTime: Date.UTC,
      },
    };

    return this.http.delete(`${this.castUrl}`, options);
  }
}
