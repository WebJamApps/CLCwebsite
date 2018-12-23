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
  }

  types = ['Forum', 'Newsletter'];

  async activate() {
    this.app.dashboardTitle = 'CLC Admin';
    const uid = this.app.auth.getTokenPayload().sub;
    this.user = await this.app.appState.getUser(uid);
    this.app.role = this.user.userType;
    this.types.sort();
    await this.setupValidation();
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
    // https://www.dropbox.com/s/b0x8winvr2ecuay/December%20Forum%202018.pdf?dl=0
    let urlArr = this.newBook.title.split('/');
    urlArr = urlArr[5].split('.pdf');
    this.newBook.title = urlArr[0].replace('%20', ' ');
    this.newBook.title = this.newBook.title.replace('%20', ' ');
    this.newBook.title = `${this.newBook.title}.pdf`;
    // console.log(this.newBook.title);
    // console.log(urlArr);
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
}
