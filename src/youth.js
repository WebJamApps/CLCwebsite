import {
  inject
} from 'aurelia-framework';
import {
  App
} from './app';

// const showSlides = require('./commons/showSlides');
const utils = require('./commons/utils');
@inject(App)
export class Youth {
  constructor(app) {
    this.app = app;
    this.utils = utils;
    // this.top = null;
    // this.youthContent = { title: '', comments: '' };
    // this.slideshowImages = [];
  }

  get widescreenHomepage() { return document.documentElement.clientWidth > 1200; }
  async activate() {
    let picUrls = [];
    try {
      picUrls = await this.utils.setupPage(this, 'youthPageContent', 'youthPics');
    } catch (e) { return sessionStorage.setItem('youthError', `${e.message}`); }
    // let res, picUrls;
    // try {
    //   res = await this.app.httpClient.fetch('/book/one?type=youthPageContent');
    //   if (res !== null && res !== undefined) this.youthContent = await res.json();
    //   picUrls = await this.app.httpClient.fetch('/book?type=youthPics');
    //   if (picUrls !== null && picUrls !== undefined) picUrls = await picUrls.json();
    // } catch (e) { return sessionStorage.setItem('youthError', `${e.message}`); }
    return this.utils.setupPics(picUrls, this);
  }
  // setYouthPics(picUrls) {
  //   this.slideshowImages = [];
  //   for (let i = 0; i < picUrls.length; i += 1) {
  //     if (picUrls[i].url === null || picUrls[i].url === undefined || picUrls[i].url === '') picUrls[i].url = picUrls[i].comments;
  //     this.slideshowImages.push({ src: picUrls[i].url });
  //   }
  // }
}
