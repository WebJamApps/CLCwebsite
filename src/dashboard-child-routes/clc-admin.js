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

  types = ['Monthly'];

  async activate() {
    this.app.dashboardTitle = 'CLC Admin';
    const uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(uid);
    this.app.role = this.user.userType;
    this.types.sort();
    await this.setupValidation();
    let res;
    try {
      res = await this.app.httpClient.fetch('/book');
      if (res !== null && res !== undefined) this.existingBooks = await res.json();
    } catch (e) { return sessionStorage.setItem('adminError', `${e.message}`); }// eslint-disable-line no-console
    return this.fixBooks(this.existingBooks);
  }
  fixBooks(books) {
    this.existingBooks = this.utils.filterNews(books);
    this.youthPicsArr = [];
    this.familyPicsArr = [];
    for (let i = 0; i < books.length; i += 1) {
      if (books[i].type === 'youthPics') this.youthPicsArr.push(books[i]);
      if (books[i].type === 'familyPics') this.familyPicsArr.push(books[i]);
    }
  }
  showDelete() {
    this.showDeleteButton = true;
    if (this.titleSelected === '') this.showDeleteButton = false;
  }
  deleteBook() {
    const selectBookTitle = document.getElementById('selectBookTitle');
    const id = selectBookTitle.options[selectBookTitle.selectedIndex].value;
    return this.utils.deleteBookById(id, this, 'news');
  }
  async deleteYouthPic() {
    const selectYouthPic = document.getElementById('selectYouthPic');
    const id = selectYouthPic.options[selectYouthPic.selectedIndex].value;
    return this.utils.deleteBookById(id, this, 'youth');
  }
  async deleteFamilyPic() {
    const selectFamilyPic = document.getElementById('selectFamilyPic');
    const id = selectFamilyPic.options[selectFamilyPic.selectedIndex].value;
    return this.utils.deleteBookById(id, this, 'family');
  }
  setupValidation() {
    ValidationRules
      .ensure('url').required().withMessage('URL to PDF is required')
      .ensure('type').required().withMessage('Select Weekly or Monthly')
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
    this.newBook.title = urlArr[0].replace('%20', '_');
    const spacesArr = this.newBook.title.split('%20');
    for (let i = 0; i < spacesArr.length; i += 1) this.newBook.title = this.newBook.title.replace('%20', '_');
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
    return this.utils.createBook(this, 'news', json);
  }
  async createYouthPic() {
    await this.fixUrl();
    this.newBook.type = 'youthPics';
    this.newBook.title = 'youthPics';
    return this.utils.createBook(this, 'youth', json);
  }
  async createFamilyPic() {
    await this.fixUrl();
    this.newBook.type = 'familyPics';
    this.newBook.title = 'familyPics';
    return this.utils.createBook(this, 'family', json);
  }
  async changeHomePage() {
    this.app.httpClient.fetch('/book/one?type=homePageContent', {
      method: 'put',
      body: json(this.homePageContent)
    })
      .then(() => {
        this.app.router.navigate('/?reload=true');
      });
  }
  async changeYouthPage() {
    this.app.httpClient.fetch('/book/one?type=youthPageContent', {
      method: 'put',
      body: json(this.youthPageContent)
    })
      .then(() => {
        this.app.router.navigate('/youth?reload=true');
      });
  }
  async changeFamilyPage() {
    this.app.httpClient.fetch('/book/one?type=familyPageContent', {
      method: 'put',
      body: json(this.familyPageContent)
    })
      .then(() => {
        this.app.router.navigate('/family?reload=true');
      });
  }
}
