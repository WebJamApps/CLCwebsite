import { Youth } from '../../src/youth';

describe('the Youth Module', () => {
  let youth;
  beforeEach((done) => {
    youth = new Youth();
    done();
  });

  it('checks that widescreen is boolean', (done) => {
    expect(typeof youth.widescreenYouthpage).toBe('boolean');
    done();
  });
});
