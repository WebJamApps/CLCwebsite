import { Giving } from '../../src/giving';

describe('the Giving Module', () => {
  let giving;
  beforeEach((done) => {
    giving = new Giving();
    done();
  });

  it('checks that widescreen is boolean', (done) => {
    expect(typeof giving.widescreenHomepage).toBe('boolean');
    done();
  });
});
