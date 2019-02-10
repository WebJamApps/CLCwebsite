const showSlides = require('./commons/showSlides');

export class Youth {
  constructor() {
    this.top = null;
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
}
