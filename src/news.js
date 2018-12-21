import {
  inject
} from 'aurelia-framework';
import {
  App
} from './app';
@inject(App)
export class Beliefs {
  constructor(app) {
    this.top = null;
    this.books = [];
    this.app = app;
  }

  get widescreenHomepage() { return document.documentElement.clientWidth > 1200; }
  async activate() {
    let res;
    try {
      res = await this.app.httpClient.fetch('/book/getall');
    } catch (e) { console.log(e.message); }
    if (res !== null && res !== undefined) this.books = await res.json();
    console.log(this.books);
    return this.fixBooks(this.books);
  }
  fixBooks(books) {
    console.log('here?');
    const booksArr = [];
    for (let i = 0; i < books.length; i += 1) {
      if ((books[i].type === 'Forum' || books[i].type === 'Newsletter') && books[i].access === 'CLC') booksArr.push(books[i]);
      if (books[i].created_at !== null && books[i].created_at !== undefined) {
        books[i].created_at = books[i].created_at.split('T')[0];
      }
    }
    this.books = booksArr;
  }
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
