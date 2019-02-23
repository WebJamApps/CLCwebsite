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
  }
  slideshowImages = [
    // { src: 'https://dl.dropboxusercontent.com/s/xeq3ty7tzltrl1y/21_.jpg?dl=0', style: 'max-height:5in' },
    // { src: 'https://dl.dropboxusercontent.com/s/2r4x7ipuczoon0s/image022.jpg?dl=0', style: 'max-height:5in' },
    // { src: 'https://dl.dropboxusercontent.com/s/4kk6isxtjwec2bn/image023.jpg?dl=0', style: 'max-height:5in' },
    // { src: 'https://dl.dropboxusercontent.com/s/916h50ubbd5u8rt/image024.jpg?dl=0', style: 'max-height:5in' },
    // { src: 'https://dl.dropboxusercontent.com/s/k6rdkrl7ma63417/image025.jpg?dl=0', style: 'max-height:5in' },
    // { src: 'https://dl.dropboxusercontent.com/s/a8crhcv2cbn3oao/image026.jpg?dl=0', style: 'max-height:5in' },
    // { src: 'https://dl.dropboxusercontent.com/s/e9hybdzjmn8tchg/image027.jpg?dl=0', style: 'max-height:5in' },
    // { src: 'https://dl.dropboxusercontent.com/s/qowexq8um5v1ve6/image028.jpg?dl=0', style: 'max-height:5in' },
    // { src: 'https://dl.dropboxusercontent.com/s/5hn0wzcz2b06dwr/image029.jpg?dl=0', style: 'max-height:5in' },
    // { src: 'https://dl.dropboxusercontent.com/s/k5cd13bl2w8zb3f/image030.jpg?dl=0', style: 'max-height:5in' }
  ];

  get widescreenHomepage() { return document.documentElement.clientWidth > 1200; }
  async activate() {
    let res, picUrls;
    try {
      res = await this.app.httpClient.fetch('/book/getFamilyContent');
    } catch (e) { console.log(e.message); }
    if (res !== null && res !== undefined) this.familyContent = await res.json();
    try {
      picUrls = await this.app.httpClient.fetch('/book/getFamilyPics');
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
