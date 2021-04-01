import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LiveFixture } from '../models/live-fixture';
import { SportType } from '../models/sport-type.enum';
import { Streams } from '../models/streams';

@Injectable({
  providedIn: 'root',
})
export class LivestreamingService {
  private readonly liveStreamUrl = 'http://localhost:8080/api/livestreams';

  constructor(private readonly http: HttpClient) {}

  getFixtures(
    sportType: SportType,
    fromDate: string,
    toDate: string
  ): Observable<LiveFixture[]> {
    return this.http.get<LiveFixture[]>(
      `${this.liveStreamUrl}/${sportType}/${fromDate}/${toDate}`
    );
  }

  getStreams(timerId: string): Observable<Streams> {
    return this.http.get<Streams>(`${this.liveStreamUrl}/${timerId}`);
  }
}
