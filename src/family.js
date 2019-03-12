import {
  inject
} from 'aurelia-framework';
import {
  App
} from './app';
@inject(App)
export class Family {
  constructor(app) { this.app = app; }
  get widescreenHomepage() { return document.documentElement.clientWidth > 1200; }
  activate() { return this.app.commonUtils.pageSetup(this, 'family', sessionStorage); }
  attached() { document.getElementById('top').scrollIntoView(); }
}
