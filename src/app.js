import { PLATFORM } from 'aurelia-pal';
import { inject, bindable } from 'aurelia-framework';
import { AuthorizeStep, AuthService } from 'aurelia-auth';
import { json, HttpClient } from 'aurelia-fetch-client';
import 'isomorphic-fetch';
import 'whatwg-fetch';
import * as Hammer from 'hammerjs';
import { UserAccess } from './classes/UserAccess';
import { AppState } from './classes/AppState';

const appUtils = require('./commons/appUtils');

@inject(AuthService, HttpClient)
export class App {
  constructor(auth, httpClient) {
    this.auth = auth;
    this.httpClient = httpClient;
    this.dashboardTitle = 'Dashboard';
    this.role = '';
    this.menuToggled = false;
    this.style = 'wj';
    this.appUtils = appUtils;
  }

  authenticated = false;

  @bindable
  drawerWidth = '220px';

  @bindable
  contentWidth = '0px';

  @bindable
  fullmenu = true;

  async activate() {
    this.configHttpClient();
    this.appState = new AppState(this.httpClient);
    this.userAccess = new UserAccess(this.appState);
    await this.appUtils.checkUser(this);
  }

  showForm(appName, className) {
    className.startup(appName);
  }

  async authenticate(name) {
    let ret;
    try {
      ret = await this.auth.authenticate(name, false, { isOhafUser: this.appState.isOhafLogin });
    } catch (e) { return Promise.reject(e); }
    this.auth.setToken(ret.token);
    return Promise.resolve(ret.token);
  }

  configHttpClient() {
    this.httpClient.configure((httpConfig) => {
      httpConfig
        .withDefaults({
          mode: 'cors',
          credentials: 'same-origin',
          headers: {
            Accept: 'application/json'
          }
        })
        .useStandardConfiguration()
        .withBaseUrl(process.env.BackendUrl)
        .withInterceptor(this.auth.tokenInterceptor); // Adds bearer token to every HTTP request.
    });
  }

  mapConfig(config) {
    return config.map([ // There is no way to refactor this that I can tell
      {
        route: 'dashboard',
        name: 'dashboard-router',
        moduleId: PLATFORM.moduleName('./dashboard-router'),
        nav: false,
        title: '',
        auth: true,
        settings: 'fa fa-tachometer'
      },
      {
        route: 'music',
        name: 'music',
        moduleId: PLATFORM.moduleName('./music'),
        nav: false,
        title: 'Music',
        settings: 'fa fa-music'
      },
      {
        route: 'calendar',
        name: 'calendar',
        moduleId: PLATFORM.moduleName('./calendar'),
        nav: false,
        title: 'Calendar',
        settings: 'fa fa-music'
      },
      {
        route: 'news',
        name: 'news',
        moduleId: PLATFORM.moduleName('./news'),
        nav: false,
        title: 'News & Forum',
        settings: 'fa fa-newspaper-o'
      },
      {
        route: 'prayer',
        name: 'prayer',
        moduleId: PLATFORM.moduleName('./prayer'),
        nav: false,
        title: 'Prayer & Study',
        settings: 'fa fa-book'
      },
      {
        route: 'giving',
        name: 'giving',
        moduleId: PLATFORM.moduleName('./giving'),
        nav: false,
        title: 'Giving',
        settings: 'fa fa-handshake-o'
      },
      {
        route: ['', 'home'], name: 'home', moduleId: PLATFORM.moduleName('./home'), nav: false, title: '', settings: 'fa fa-home'
      },
      {
        route: 'beliefs',
        name: 'beliefs',
        moduleId: PLATFORM.moduleName('./beliefs'),
        nav: false,
        title: 'Our Lutheran Beliefs',
        settings: 'fa fa-sign-in'
      },
      {
        route: 'staff',
        name: 'staff',
        moduleId: PLATFORM.moduleName('./staff'),
        nav: false,
        title: 'Church Staff',
        settings: 'fa fa-users'
      },
      {
        route: 'youth',
        name: 'youth',
        moduleId: PLATFORM.moduleName('./youth'),
        nav: false,
        title: 'Youth Ministry',
        settings: 'fa fa-users'
      },
      {
        route: 'family',
        name: 'family',
        moduleId: PLATFORM.moduleName('./family'),
        nav: false,
        title: 'Children & Families',
        settings: 'fa fa-users'
      },
    ]);
  }

  configureRouter(config, router) {
    config.title = 'College Lutheran Church';
    config.options.pushState = true;
    config.options.root = '/';
    config.addPipelineStep('authorize', AuthorizeStep);// Is the actually Authorization to get into the /dashboard
    config.addPipelineStep('authorize', this.userAccess);// provides access controls to prevent users from certain
    config.addPostRenderStep({
      run(routingContext, next) {
        if (!routingContext.config.settings.noScrollToTop) {
          const top = document.getElementsByClassName('material-header')[0];
          if (top !== null && top !== undefined) {
            top.scrollIntoView();
          }
        }
        return next();
      }
    });
    config = this.mapConfig(config);
    config.fallbackRoute('/');
    this.router = router;
  }

  toggleMobileMenu(toggle) {
    console.log(toggle);// eslint-disable-line no-console
    document.getElementsByClassName('page-host')[0].style.overflow = 'auto';
    if (toggle !== 'close') {
      document.getElementsByClassName('page-host')[0].style.overflow = 'hidden';
      document.getElementsByClassName('swipe-area')[0].style.width = '60px';
      document.getElementsByClassName('page-host')[0].addEventListener('click', this.appUtils.clickFunc);
    }
    this.menuToggled = true;
    const drawer = document.getElementsByClassName('drawer')[0];
    const toggleIcon = document.getElementsByClassName('mobile-menu-toggle')[0];
    if (drawer.style.display === 'none' && toggle !== 'close') {
      drawer.style.display = 'block';
      $(drawer).parent().css('display', 'block');
      toggleIcon.style.display = 'none';
    } else {
      drawer.style.display = 'none';
      $(drawer).parent().css('display', 'none');
      toggleIcon.style.display = 'block';
    }
    if (toggle === 'close') {
      document.getElementsByClassName('page-host')[0].removeEventListener('click', this.appUtils.clickFunc);
      document.getElementsByClassName('swipe-area')[0].style.width = '0px';
    }
  }

  close() {
    if (!this.widescreen) this.toggleMobileMenu('close');
  }

  async logout() {
    this.appState.setUser({});
    this.authenticated = false;
    localStorage.clear();
    if (this.role !== 'Charity' && this.role !== 'Volunteer') {
      await this.auth.logout('/');
    } else await this.auth.logout('/ohaf');
    this.role = '';
    this.appState.isOhafLogin = false;
  }

  get currentRoute() {
    if (this.router.currentInstruction) return this.router.currentInstruction.config.name;
    return null;
  }

  get currentRouteFrag() {
    if (this.router.currentInstruction) return this.router.currentInstruction.fragment;
    return null;
  }

  setFooter() {
    const footer = document.getElementById('wjfooter');
    if (footer !== null) {
      footer.style.backgroundColor = '#244a8bff';
    }
  }

  get currentStyles() {
    let result = {};
    result = {
      headerClass: 'home-header',
      headerImageClass: 'home-header-image',
      sidebarClass: 'home-sidebar',
      menuToggleClass: 'home-menu-toggle'
    };
    this.setFooter();
    this.setOtherStyles();
    return result;
  }

  setOtherStyles() {
    const menuDrawer = document.getElementsByClassName('drawer')[0];
    const navList = document.getElementsByClassName('nav-list')[0];
    const mobilemenutoggle = document.getElementById('mobilemenutoggle');
    if (menuDrawer !== undefined && menuDrawer !== null) {
      mobilemenutoggle.style.backgroundColor = '#244a8bff';
      menuDrawer.style.backgroundColor = '#c0c0c0';
      navList.style.backgroundColor = '#c0c0c0';
    }
  }

  buildPTag(object, objectSelector, objectSelectorOther, objectStoreResult) {
    for (let l = 0; l < object.length; l += 1) {
      let typeHtml = '';
      for (let i = 0; i < object[l][objectSelector].length; i += 1) {
        if (object[l][objectSelector][i] !== '') {
          if (object[l][objectSelector][i] !== 'other') {
            typeHtml = `${typeHtml}<p style="font-size:10pt; padding-top:4px; margin-bottom:4px">${object[l][objectSelector][i]}</p>`;
          } else {
            typeHtml = `${typeHtml}<p style="font-size:10pt; padding-top:4px; margin-bottom:4px">${object[l][objectSelectorOther]}</p>`;
          }
        }
      }
      if (typeHtml === '') {
        typeHtml = '<p style="font-size:10pt">not specified</p>';
      }
      object[l][objectStoreResult] = typeHtml;
    }
  }

  selectPickedChange(selectorObj, thisObj, mainSelectedList, selectorOtherVariable, otherVariable, selectorUseThis = false, userVariable) {
    if (userVariable) {
      selectorObj[userVariable] = thisObj[mainSelectedList];
    }
    let exists = false;
    if (selectorUseThis === true) {
      if (thisObj[mainSelectedList].includes('other')) {
        exists = true;
      }
    } else if (selectorObj[mainSelectedList].includes('other')) {
      exists = true;
    }
    if (exists === true) {
      thisObj[otherVariable] = true;
    } else {
      thisObj[otherVariable] = false;
      selectorObj[selectorOtherVariable] = '';
    }
  }

  async updateById(route, id, dataObj) {
    try {
      const cb = await this.httpClient.fetch(route + id, {
        method: 'put',
        body: json(dataObj)
      });
      return cb.json();
    } catch (e) { return e; }
  }

  get widescreen() {
    return this.appUtils.handleScreenSize(this, document.documentElement.clientWidth > 900,
      $(document.getElementsByClassName('drawer')).parent());
  }

  attached() {
    this.manager = new Hammer.Manager(document.getElementsByClassName('swipe-area')[0], {
      recognizers: [
        [Hammer.Swipe, { direction: Hammer.DIRECTION_HORIZONTAL }]
      ]
    });
    this.manager.on('swipe', this.close.bind(this));
    if (document.location.search.includes('oneplayer=true')) {
      document.getElementsByClassName('content-block')[0].style.overflow = 'hidden';
      document.getElementsByClassName('content-block')[0].style.marginTop = '0';
      document.getElementsByClassName('page-content')[0].style.borderRight = '0';
      const wms = document.getElementById('wholeMusicSection'); // .style.display = 'none';
      const h4 = document.getElementsByTagName('h4')[0];
      const header = document.getElementsByClassName('home-header')[0];
      const footer = document.getElementById('wjfooter');
      const i = document.getElementById('mobilemenutoggle');
      const child = document.getElementsByClassName('home-sidebar')[0];
      child.parentNode.removeChild(child);
      i.parentNode.removeChild(i);
      wms.parentNode.removeChild(wms);
      h4.parentNode.removeChild(h4);
      footer.parentNode.removeChild(footer);
      header.parentNode.removeChild(header);
    }
    document.querySelectorAll('body > div > div.au-target.home-sidebar.drawer-container > div > div.nav-list > div.menu-item > a')
      .forEach((el) => { el.addEventListener('click', appUtils.menuClick); });
  }

  detached() {
    this.manager.off('swipe', this.close.bind(this));
    const ph = document.getElementsByClassName('page-host')[0];
    ph.removeEventListener('click', this.appUtils.clickFunc);
    ph.setAttribute('hasEvent', false);
  }
}
