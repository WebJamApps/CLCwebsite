import { Staff } from '../../src/staff';

describe('the Staff Module', () => {
  let staff;
  beforeEach((done) => {
    staff = new Staff();
    done();
  });

  it('checks that widescreen is boolean', (done) => {
    expect(typeof staff.widescreenHomepage).toBe('boolean');
    done();
  });
});
