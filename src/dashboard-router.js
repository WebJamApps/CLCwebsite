import { PLATFORM } from 'aurelia-pal';

export class DashboardRouter {
  heading = 'Dashboard Router';

  configureRouter(config, router) {
    config.map([ // There is no way to refactor this that I can tell
      {
        route: '', name: 'dashboard', moduleId: PLATFORM.moduleName('./dashboard'), nav: false, title: 'Dashboard', auth: true
      },
      {
        route: 'developer',
        name: 'developer',
        moduleId: PLATFORM.moduleName('./dashboard-child-routes/developer'),
        nav:
        false,
        title: 'Developer',
        auth: true
      },
      {
        route: 'user-account',
        name: 'user-account',
        moduleId: PLATFORM.moduleName('./dashboard-child-routes/user-account'),
        nav:
        true,
        title: 'User Account',
        auth: true
      }
    ]);
    this.router = router;
  }
}
