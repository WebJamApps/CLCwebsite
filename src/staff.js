export class Staff {
  get widescreenHomepage() { return document.documentElement.clientWidth > 1200; }
  jump(h) {
    document.getElementById(h).scrollIntoView();
  }
}
