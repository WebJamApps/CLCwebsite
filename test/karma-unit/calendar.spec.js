import { Calendar } from '../../src/calendar';

describe('the Calendar Module', () => {
  let calendar;
  beforeEach((done) => {
    calendar = new Calendar();
    done();
  });

  it('checks that widescreen is boolean', (done) => {
    expect(typeof calendar.widescreenHomepage).toBe('boolean');
    done();
  });
});
