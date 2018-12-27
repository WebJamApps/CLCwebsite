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
      res = await this.app.httpClient.fetch('/book/getHomeContent');
    } catch (e) { console.log(e.message); }
    if (res !== null && res !== undefined) this.homeContent = await res.json();
    console.log(this.homeContent);
  }

  get widescreenHomepage() { return document.documentElement.clientWidth > 1200; }

  attached() {
    this.searchParams = new URLSearchParams(window.location.search);
    if (this.searchParams.get('reload')) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'test') window.location.href = window.location.href.split('?')[0];
    }
    this.top = document.getElementsByClassName('material-header')[0];
    if (this.top !== null && this.top !== undefined) this.top.scrollIntoView();
  }
}
