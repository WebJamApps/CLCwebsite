import {
  inject
} from 'aurelia-framework';
import {
  App
} from './app';
@inject(App)
export class Home {
  constructor(app) {
    this.app = app;
    this.top = null;
    this.homeContent = { title: '', comments: '' };
  }
  async activate() {
    let res;
    try {
      res = await this.app.httpClient.fetch('/book/one?type=homePageContent');
      if (res !== null && res !== undefined) this.homeContent = await res.json();
    } catch (e) { return sessionStorage.setItem('homeError', `${e.message}`); }
    return true;
  }

  get widescreenHomepage() { return document.documentElement.clientWidth > 1200; }
}
