import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { ChromecastState } from '../../state/chromecast.state';
import { ChromecastService } from '../../services/chromecast.service';
import {
  AddChromecast,
  SetSelectedChromecast,
} from '../../state/actions/chromecasts.actions';

@Component({
  selector: 'client-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Select(ChromecastState.chromecasts)
  chromecasts$!: Observable<string[]>;
  @Select(ChromecastState.selectedChromecast)
  selectedChromecast$!: Observable<string>;

  chromecastWs$!: Subscription;

  constructor(
    private readonly store: Store,
    private readonly chromecastService: ChromecastService
  ) {}

  ngOnInit(): void {
    this.chromecastWs$ = this.chromecastService.getChromecasts().subscribe(
      (chromecast) => {
        this.store.dispatch(new AddChromecast(chromecast));
      },
      (err) => console.log(err),
      () => console.log('complete')
    );
  }

  ngOnDestroy(): void {
    this.chromecastWs$.unsubscribe();
  }

  selectChromecast(name: string): void {
    this.store.dispatch(new SetSelectedChromecast(name));
  }
}
