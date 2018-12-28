import { App } from '../../src/app';
import {
  AuthStub, HttpMock, RouterStub, AppStateStub
} from './commons';

const Counter = require('assertions-counter');

class AuthStub2 extends AuthStub {
  isAuthenticated() {
    this.authenticated = false;
    return this.authenticated;
  }
}
function testAsync(runAsync) {
  return (done) => {
    runAsync().then(done, (e) => { fail(e); done(); });
  };
}
describe('the App module', () => {
  let app1, app2;
  beforeEach(() => {
    app1 = new App(new AuthStub(), new HttpMock());
    app1.auth.setToken('No token');
    app1.activate();
    app1.appState = new AppStateStub();
    app2 = new App(new AuthStub2(), new HttpMock());
    app2.activate();
    app2.appState = new AppStateStub();
  });
  it('tests configHttpClient', (done) => {
    const { add: ok } = new Counter(4, done);
    app1.auth.tokenInterceptor = 'tokenInterceptor';
    app1.configHttpClient();
    app1.httpClient.__configureCallback(new (class {
      withDefaults(opts) {
        expect(opts.mode).toBe('cors');
        ok();
        return this;
      }

      useStandardConfiguration() {
        ok();
        return this;
      }

      withBaseUrl() {
        ok();
        return this;
      }

      withInterceptor(token) {
        expect(token).toBe(app1.auth.tokenInterceptor);
        ok();
        return this;
      }
    })());
  });
  it('updates by id', testAsync(async () => {
    await app1.updateById('/volopp/', '123', {});
  }));
  it('should provide a login page for OHAF', (done) => {
    app1.activate().then(() => {
      app1.ohafLogin();
    });
    done();
  });
  it('should provide a login page for WJ', (done) => {
    app1.activate().then(() => {
      app1.wjLogin();
    });
    done();
  });
  it('should sent an OHAF user to /OHAF on logout', (done) => {
    app1.role = 'Charity';
    app1.logout();
    done();
  });
  it('tests logout', testAsync(async () => {
    await app1.activate();
    await app1.logout();
    expect(app1.authenticated).toBe(false);
  }));
  it('gets the current fragment', (done) => {
    app1.router = new RouterStub();
    const frag = app1.currentRouteFrag;
    const cr = app1.currentRoute;
    expect(typeof frag).toBe('object');
    expect(cr).toBeDefined();
    done();
  });
  it('leaves the styles set to wj if undefined route frag', (done) => {
    done();
  });
  it('should be able to configure router', (done) => {
    const config = {
      options: {},
      addPipelineStep(a, b) { return null; },
      addPostRenderStep(obj) { return obj; },
      map(list) { return this; },
      fallbackRoute(arg) { return arg; }
    };
    app1.configureRouter(config, {});
    expect(typeof app1.router).toBe('object');
    done();
  });
  it('gets the current styles with login route', (done) => {
    const routre = new RouterStub();
    routre.currentInstruction.config.name = 'login';
    document.body.innerHTML = '<div id="wjfooter" class="footer drawer nav-list"><i id="mobilemenutoggle"></i></div>';
    app1.router = routre;
    const cs = app1.currentStyles;
    expect(app1.Menu).toBe('wj');
    expect(cs).toBeDefined();
    done();
  });
  it('should toggle mobile menu', (done) => {
    spyOn(document, ['getElementsByClassName']).and.returnValue([
      {
        style: { overflow: '', display: '' },
        addEventListener(a, b) { },
        removeEventListener(a, b) { }
      }
    ]);
    document.body.innerHTML = '<div class="page-host drawer mobile-menu-toggle main-panel swipe-area"></div>';
    // const toggleIcon = document.getElementsByClassName('mobile-menu-toggle')[0];
    app1.toggleMobileMenu();
    app1.toggleMobileMenu('close');
    // expect(toggleIcon.style.display).toBe('block');
    // document.getElementsByClassName('drawer')[0].style.display = 'none';
    // app1.toggleMobileMenu();
    // expect(toggleIcon.style.display).toBe('none');
    done();
  });
  it('should toggle menu to be icons with text', () => {
    // document.body.innerHTML = '<div class="main-panel"></div><div class="drawer-container"></div><div class="nav-list"></div>';
    // app1.fullmenu = false;
    // app1.toggleMenu();
    // expect(app1.fullmenu).toBe(true);
    // expect(app1.drawerWidth).toBe('182px');
  });
  it('should detach', (done) => {
    spyOn(document, ['getElementsByClassName']).and.returnValue([
      {
        style: {
          overflow: '', display: '', marginRight: '', width: ''
        },
        addEventListener(a, b) { },
        removeEventListener(a, b) { },
        setAttribute(a, b) { }
      }
    ]);
    app1.manager = {
      off(a, b) { }
    };
    app1.detached();
    done();
  });
});
