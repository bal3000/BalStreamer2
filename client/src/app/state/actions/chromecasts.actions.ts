import { Chromecast } from 'src/app/models/chromecast';

export class GetChromecasts {
  static readonly type = '[BalStreamer] Get Chromecasts';
}

export class AddChromecast {
  static readonly type = '[BalStreamer] Add Chromecast';
  constructor(public chromecast: Chromecast) {}
}

export class RemoveChromecast {
  static readonly type = '[BalStreamer] Remove Chromecast';
  constructor(public chromecast: Chromecast) {}
}

export class SetSelectedChromecast {
  static readonly type = '[BalStreamer] Select Chromecast';
  constructor(public chromecast: string) {}
}
