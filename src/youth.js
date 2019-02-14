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
    { src: 'https://dl.dropboxusercontent.com/s/kifthze5olgkuub/image013.jpg?dl=0', style: 'max-height:5in' },
    { src: 'https://dl.dropboxusercontent.com/s/lee7y7y925su50b/image014.jpg?dl=0', style: 'max-height:5in' },
    { src: 'https://dl.dropboxusercontent.com/s/ft9ps7ut6gee258/image015.jpg?dl=0', style: 'max-height:5in' },
    { src: 'https://dl.dropboxusercontent.com/s/1dej0j030npsdwy/image016.jpg?dl=0', style: 'max-height:5in' },
    { src: 'https://dl.dropboxusercontent.com/s/6rsyfv2tqzz9kbe/image017.jpg?dl=0', style: 'max-height:5in' },
    { src: 'https://dl.dropboxusercontent.com/s/6rsyfv2tqzz9kbe/image018.jpg?dl=0', style: 'max-height:5in' }
  ];

  get widescreenHomepage() { return document.documentElement.clientWidth > 1200; }
  async activate() {
    let res;
    try {
      res = await this.app.httpClient.fetch('/book/getYouthContent');
    } catch (e) { console.log(e.message); }
    if (res !== null && res !== undefined) this.youthContent = await res.json();
  }
}
