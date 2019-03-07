import { Music } from '../../src/music';

describe('the Music Module', () => {
  let music;
  beforeEach((done) => {
    music = new Music();
    done();
  });

  it('checks that widescreen is boolean', (done) => {
    expect(typeof music.widescreenHomepage).toBe('boolean');
    done();
  });
});
