import { Home } from '../../src/home';

describe('the Home Module', () => {
  let home;
  beforeEach((done) => {
    home = new Home();
    done();
  });

  it('checks that widescreen is boolean', (done) => {
    expect(typeof home.widescreenHomepage).toBe('boolean');
    done();
  });
});
