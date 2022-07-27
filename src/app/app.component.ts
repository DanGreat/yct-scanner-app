import { Component } from '@angular/core';
import { BackButtonHandlerService } from './back-button-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private backButtonService: BackButtonHandlerService,) {
    this.backButtonService.init();
  }
}
