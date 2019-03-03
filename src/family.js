import {
  inject
} from 'aurelia-framework';
import {
  App
} from './app';

const utils = require('./commons/utils');
@inject(App)
export class Family {
  constructor(app) {
    this.utils = utils;
    this.app = app;
  }

  get widescreenHomepage() { return document.documentElement.clientWidth > 1200; }
  async activate() {
    let picUrls = [];
    try {
      picUrls = await this.utils.setupPage(this, 'familyPageContent', 'familyPics');
    } catch (e) { return sessionStorage.setItem('familyError', `${e.message}`); }
    return this.utils.setupPics(picUrls, this);
  }
  // setFamilyPics(picUrls) {
  //   this.slideshowImages = [];
  //   for (let i = 0; i < picUrls.length; i += 1) {
  //     if (picUrls[i].url === null || picUrls[i].url === undefined || picUrls[i].url === '') picUrls[i].url = picUrls[i].comments;
  //     this.slideshowImages.push({ src: picUrls[i].url });
  //   }
  // }
}
