import {
  ValidationControllerFactory, ValidationRules, Validator, validateTrigger
} from 'aurelia-validation';
import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { App } from '../app';
import { FormValidator } from '../classes/FormValidator';

const utils = require('../commons/utils');
@inject(App, ValidationControllerFactory, Validator)
export class ClcAdmin {
  constructor(app, controllerFactory, validator) {
    this.app = app;
    this.utils = utils;
    this.newBook = {
      title: '',
      type: '',
      url: '',
      access: 'CLC'
    };
    this.validator = new FormValidator(validator, results => this.updateCanSubmit(results)); // if the form is valid then set to true.
    this.controller = controllerFactory.createForCurrentScope(this.validator);
    this.controller.validateTrigger = validateTrigger.changeOrBlur;
    this.canSubmit = false; // the button on the form
    this.validType = false;
    this.existingBooks = [];
    this.titleSelected = '';
    this.showDeleteButton = false;
    this.homePageContent = { title: '', comments: '', type: 'homePageContent' };
    this.youthPageContent = { title: '', comments: '', type: 'youthPageContent' };
    this.familyPageContent = { title: '', comments: '', type: 'familyPageContent' };
    this.youthPicsArr = [];
    this.familyPicsArr = [];
  }

  types = ['Weekly', 'Monthly'];

  async activate() {
    this.app.dashboardTitle = 'CLC Admin';
    const uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(uid);
    this.app.role = this.user.userType;
    this.types.sort();
    await this.setupValidation();
    let res;
    try {
      res = await this.app.httpClient.fetch('/book/getall');
    } catch (e) { console.log(e.message); }// eslint-disable-line no-console
    if (res !== null && res !== undefined) this.existingBooks = await res.json();
    return this.fixBooks(this.existingBooks);
  }
  fixBooks(books) {
    // console.log('here?');
    const booksArr = [];
    this.youthPicsArr = [];
    this.familyPicsArr = [];
    for (let i = 0; i < books.length; i += 1) {
      if ((books[i].type === 'Forum' || books[i].type === 'Newsletter') && books[i].access === 'CLC') booksArr.push(books[i]);
      if (books[i].type === 'youthPics') this.youthPicsArr.push(books[i]);
      if (books[i].type === 'familyPics') this.familyPicsArr.push(books[i]);
      // if (books[i].created_at !== null && books[i].created_at !== undefined) {
      //   books[i].created_at = books[i].created_at.split('T')[0];
      // }
    }
    this.existingBooks = booksArr;
    // console.log(this.existingBooks);
  }
  showDelete() {
    this.showDeleteButton = true;
    if (this.titleSelected === '') this.showDeleteButton = false;
  }
  async deleteBook() {
    const selectBookTitle = document.getElementById('selectBookTitle');
    const id = selectBookTitle.options[selectBookTitle.selectedIndex].value;
    console.log(id);
    let res, message;
    try {
      res = await this.app.httpClient.fetch(`/book/${id}`, {
        method: 'delete'
      });
      message = await res.json();
    } catch (e) { return console.log(e.message); }
    return this.app.router.navigate('/news');
  }
  async deleteYouthPic() {
    const selectYouthPic = document.getElementById('selectYouthPic');
    const id = selectYouthPic.options[selectYouthPic.selectedIndex].value;
    console.log(id);
    let res, message;
    try {
      res = await this.app.httpClient.fetch(`/book/${id}`, {
        method: 'delete'
      });
      message = await res.json();
    } catch (e) { return console.log(e.message); }
    return this.app.router.navigate('/youth');
  }
  async deleteFamilyPic() {
    const selectFamilyPic = document.getElementById('selectFamilyPic');
    const id = selectFamilyPic.options[selectFamilyPic.selectedIndex].value;
    console.log(id);
    let res, message;
    try {
      res = await this.app.httpClient.fetch(`/book/${id}`, {
        method: 'delete'
      });
      message = await res.json();
    } catch (e) { return console.log(e.message); }
    console.log(message.message);
    return this.app.router.navigate('/family');
  }
  setupValidation() {
    ValidationRules
      .ensure('url').required().withMessage('URL to PDF is required')
      .ensure('type').required().withMessage('Select Forum or Newsletter')
      .on(this.newBook);
    return Promise.resolve(true);
  }
  updateCanSubmit(validationResults) {
    let valid = true;
    const nub = document.getElementById('createMediaButton');
    nub.style.display = 'none';
    for (const result of validationResults) {
      if (result.valid === false) {
        valid = false;
        nub.style.display = 'none';
        break;
      }
    }
    this.canSubmit = valid;
    if (this.canSubmit && this.newBook.type !== 0) {
      nub.style.display = 'block';
    }
    return this.canSubmit;
  }
  setTitle() {
    this.newBook.title = this.newBook.url;
    let urlArr = this.newBook.title.split('/');
    urlArr = urlArr[5].split('.pdf');
    this.newBook.title = urlArr[0].replace('%20', ' ');
    this.newBook.title = this.newBook.title.replace('%20', ' ');
    this.newBook.title = `${this.newBook.title}.pdf`;
    return Promise.resolve(true);
  }
  fixUrl() {
    this.newBook.url = this.newBook.url.replace('www.dropbox', 'dl.dropboxusercontent');
    return Promise.resolve(true);
  }
  async createBook() {
    await this.setTitle();
    await this.fixUrl();
    console.log(this.newBook);
    this.app.httpClient.fetch('/book/create', {
      method: 'post',
      body: json(this.newBook)
    })
      .then(() => {
        this.app.router.navigate('/news');
      });
  }
  async createYouthPic() {
    console.log(this.newBook);
    await this.fixUrl();
    this.newBook.type = 'youthPics';
    this.newBook.title = 'youthPics';
    this.newBook.comments = this.newBook.url;
    console.log(this.newBook);
    this.app.httpClient.fetch('/book/create', {
      method: 'post',
      body: json(this.newBook)
    })
      .then(() => {
        this.app.router.navigate('/youth');
      });
  }
  async createFamilyPic() {
    console.log(this.newBook);
    await this.fixUrl();
    this.newBook.type = 'familyPics';
    this.newBook.title = 'familyPics';
    this.newBook.comments = this.newBook.url;
    console.log(this.newBook);
    this.app.httpClient.fetch('/book/create', {
      method: 'post',
      body: json(this.newBook)
    })
      .then(() => {
        this.app.router.navigate('/family');
      });
  }
  async changeHomePage() {
    console.log(this.homePageContent);
    this.app.httpClient.fetch('/book/homepage', {
      method: 'put',
      body: json(this.homePageContent)
    })
      .then(() => {
        this.app.router.navigate('/?reload=true');
      });
  }
  async changeYouthPage() {
    console.log(this.youthPageContent);
    this.app.httpClient.fetch('/book/youthpage', {
      method: 'put',
      body: json(this.youthPageContent)
    })
      .then(() => {
        this.app.router.navigate('/youth?reload=true');
      });
  }
  async changeFamilyPage() {
    console.log(this.familyPageContent);
    this.app.httpClient.fetch('/book/familypage', {
      method: 'put',
      body: json(this.familyPageContent)
    })
      .then(() => {
        this.app.router.navigate('/family?reload=true');
      });
  }
}
