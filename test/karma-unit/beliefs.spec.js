import { Beliefs } from '../../src/beliefs';

describe('the Beliefs Module', () => {
  let beliefs;
  beforeEach((done) => {
    beliefs = new Beliefs();
    done();
  });

  it('checks that widescreen is boolean', (done) => {
    expect(typeof beliefs.widescreenHomepage).toBe('boolean');
    done();
  });
});
