import {
  inject
} from 'aurelia-framework';
import {
  App
} from './app';

@inject(App)
export class Youth {
  constructor(app) { this.app = app; }
  get widescreenYouthpage() { return document.documentElement.clientWidth > 1200; }
  activate() { return this.app.commonUtils.pageSetup(this, 'youth', sessionStorage); }
  attached() { document.getElementById('top').scrollIntoView(); }
}
