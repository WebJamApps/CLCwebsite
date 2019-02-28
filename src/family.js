import {
  inject
} from 'aurelia-framework';
import {
  App
} from './app';

const showSlides = require('./commons/showSlides');
@inject(App)
export class Family {
  constructor(app) {
    this.app = app;
    this.top = null;
    this.familyContent = { title: '', comments: '' };
    this.slideshowImages = [];
  }

  get widescreenHomepage() { return document.documentElement.clientWidth > 1200; }
  async activate() {
    let res, picUrls;
    try {
      res = await this.app.httpClient.fetch('/book/findOne?type=familyPageContent');
      if (res !== null && res !== undefined) this.familyContent = await res.json();
      picUrls = await this.app.httpClient.fetch('/book?type=familyPics');
      if (picUrls !== null && picUrls !== undefined) picUrls = await picUrls.json();
    } catch (e) { sessionStorage.setItem('familyError', `${e.message}`); }
    // try {
    //
    // } catch (e) { console.log(e.message); }
    // console.log('fetched');
    // if (picUrls !== null && picUrls !== undefined) {
    //   picUrls = await picUrls.json();
    //   console.log(picUrls);
    //   this.slideshowImage = [];
    //   for (let i = 0; i < picUrls.length; i += 1) this.slideshowImages.push({ src: picUrls[i].comments });
    //   console.log(this.slideshowImages);
    // }
    return this.setFamilyPics(picUrls);
  }
  setFamilyPics(picUrls) {
    this.slideshowImages = [];
    for (let i = 0; i < picUrls.length; i += 1) {
      if (picUrls[i].url === null || picUrls[i].url === undefined || picUrls[i].url === '') picUrls[i].url = picUrls[i].comments;
      this.slideshowImages.push({ src: picUrls[i].url });
    }
  }
}
