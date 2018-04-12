import { Component } from '@angular/core';
import { slideAnimation } from './router.animations';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Store } from './store/store';

@Component({
  selector: 'app-root',
  animations: [slideAnimation],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private _iconRegistry: MatIconRegistry,
    private _sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    public store: Store
  ) {
    this.loadIcons(_iconRegistry, _sanitizer);
  }

  loadIcons(_iconRegistry: MatIconRegistry, _sanitizer: DomSanitizer) {
    _iconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
