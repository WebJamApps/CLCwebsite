import { News } from '../../src/news';

describe('the News Module', () => {
  let news;
  beforeEach((done) => {
    news = new News();
    done();
  });

  it('checks that widescreen is boolean', (done) => {
    expect(typeof news.widescreenHomepage).toBe('boolean');
    done();
  });
});
