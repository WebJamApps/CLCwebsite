import { Family } from '../../src/family';

describe('the Family Module', () => {
  let family;
  beforeEach((done) => {
    family = new Family();
    done();
  });

  it('checks that widescreen is boolean', (done) => {
    expect(typeof family.widescreenHomepage).toBe('boolean');
    done();
  });
});
