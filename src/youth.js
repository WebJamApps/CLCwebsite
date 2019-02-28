import {
  inject
} from 'aurelia-framework';
import {
  App
} from './app';

const showSlides = require('./commons/showSlides');

@inject(App)
export class Youth {
  constructor(app) {
    this.app = app;
    this.top = null;
    this.youthContent = { title: '', comments: '' };
  }
  slideshowImages = [
  ];

  get widescreenHomepage() { return document.documentElement.clientWidth > 1200; }
  async activate() {
    let res, picUrls;
    try {
      res = await this.app.httpClient.fetch('/book/findOne?type=youthPageContent');
      if (res !== null && res !== undefined) this.youthContent = await res.json();
    } catch (e) { sessionStorage.setItem('youthError', `${e.message}`); }
    try {
      picUrls = await this.app.httpClient.fetch('/book/getYouthPics');
    } catch (e) { console.log(e.message); }
    console.log('fetched');
    if (picUrls !== null && picUrls !== undefined) {
      picUrls = await picUrls.json();
      console.log(picUrls);
      this.slideshowImage = [];
      for (let i = 0; i < picUrls.length; i += 1) this.slideshowImages.push({ src: picUrls[i].comments });
      console.log(this.slideshowImages);
    }
  }
}
