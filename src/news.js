import {
  inject,
} from 'aurelia-framework';
import {
  App,
} from './app';

const utils = require('./commons/utils');
@inject(App)
export class News {
  constructor(app) {
    this.books = [];
    this.app = app;
    this.utils = utils;
  }

  get widescreenHomepage() { return document.documentElement.clientWidth > 1200; }
  async activate() {
    let res;
    try {
      res = await this.app.httpClient.fetch('/book');
    } catch (e) { console.log(e.message); } // eslint-disable-line no-console
    if (res !== null && res !== undefined) this.books = await res.json();
    return this.fixBooks(this.books);
  }
  fixBooks(books) {
    books = this.utils.filterNews(books);
    for (let i = 0; i < books.length; i += 1) {
      if (books[i].created_at !== null && books[i].created_at !== undefined) {
        books[i].created_at = books[i].created_at.split('T')[0];// eslint-disable-line prefer-destructuring
      }
    }
    return this.continueFixBooks(books);
  }
  continueFixBooks(booksArr) {
    for (let j = 0; j < booksArr.length; j += 1) {
      if (booksArr[j].type === 'Forum') booksArr[j].type = 'Monthly';
      if (booksArr[j].type === 'Newsletter') booksArr[j].type = 'Weekly';
    }
    this.books = booksArr;
  }
  attached() {
    const top = document.getElementById('top');
    top.scrollIntoView();
  }
}
