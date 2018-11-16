export class MusicRouter {
  heading = 'Music Router';

  configureRouter(config, router) {
    config.map([
      {
        route: '', name: 'music', moduleId: PLATFORM.moduleName('./music'), nav: true, title: 'Music'
      },
      {
        route: 'buymusic', name: 'buymusic', moduleId: PLATFORM.moduleName('./music-child-routes/buymusic'), nav: true, title: 'Buy Music'
      }
    ]);
    this.router = router;
  }
}
