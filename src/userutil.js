const User_ = require('./classes/User_.js');

export class UserUtil {
  constructor() {
    this.userClass = {};
  }
  attached() {
    this.userClass = new User_();
  }
}
