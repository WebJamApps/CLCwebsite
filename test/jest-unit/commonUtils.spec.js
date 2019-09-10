const sinon = require('sinon');
const filesaver = require('file-saver');
const utils = require('../../src/commons/utils');
const showSlides = require('../../src/commons/showSlides');

const event = [{
  _id: '234',
  voName: 'run the swamp',
  voCharityId: '123',
  voCharityName: 'howdy',
  voloppId: 1,
  voNumPeopleNeeded: 1,
  voDescription: '',
  voWorkTypes: [],
  voTalentTypes: [],
  voWorkTypeOther: '',
  voTalentTypeOther: '',
  voStartDate: '2017-01-01T10:14:32.909Z',
  voStartTime: '10:10 am',
  voEndDate: '2018-11-14T10:14:32.909Z',
  voEndTime: '8:15pm',
  voContactName: '',
  voContactEmail: '',
  voContactPhone: '',
}];
// const controllerStub = { app: { router: { navigate() { return Promise.resolve(true); } },
//   httpClient: { fetch() { return Promise.resolve(true); } } } };

describe('the common utils', () => {
  let controllerStub;
  beforeEach((done) => {
    controllerStub = { app: { router: { navigate() { return Promise.resolve(true); } },
      httpClient: { fetch() { return Promise.resolve({ json() { return Promise.resolve({ something: true }); } }); } } } };
    jest.useFakeTimers();
    done();
  });
  it('filters news', (done) => {
    const newsArr = utils.filterNews([{ type: 'Monthly', access: 'CLC' }]);
    expect(newsArr.length).toBe(1);
    done();
  });
  it('filters news but finds none', (done) => {
    const newsArr = utils.filterNews([{ type: 'Weekly', access: 'public' }]);
    expect(newsArr.length).toBe(0);
    done();
  });
  it('sets up the slideshow', (done) => {
    utils.setupPics([{ type: 'family', comments: 'hi' }], controllerStub);
    expect(controllerStub.slideshowImages.length).toBe(1);
    done();
  });
  it('sets up the slideshow with correct urls', (done) => {
    utils.setupPics([{ type: 'family', comments: 'hi', url: 'hi' }], controllerStub);
    expect(controllerStub.slideshowImages.length).toBe(1);
    done();
  });
  it('creates a book', async () => {
    let result;
    try {
      result = await utils.createBook(controllerStub, '', () => {});
      expect(result).toBe(true);
    } catch (e) { throw e; }
  });
  it('catches error on creates a book', async () => {
    controllerStub.app.httpClient.fetch = function fetch() { return Promise.reject(new Error('bad')); };
    window.sessionStorage = {
      setItem(key, string) {
        expect(string).toBe('bad');
      },
    };
    try {
      await utils.createBook(controllerStub, '', () => {});
    } catch (e) { throw e; }
  });
  it('deletes a book by id', async () => {
    let result;
    try {
      result = await utils.deleteBookById('', controllerStub, '');
      expect(result).toBe(true);
    } catch (e) { throw e; }
  });
  it('catches error on delete a book by id', async () => {
    controllerStub.app.httpClient.fetch = function fetch() { return Promise.reject(new Error('bad')); };
    window.sessionStorage = {
      setItem(key, string) {
        expect(string).toBe('bad');
      },
    };
    try {
      await utils.deleteBookById('', controllerStub, '');
    } catch (e) { throw e; }
  });
  it('sets up the page', async () => {
    let result;
    try {
      result = await utils.setupPage(controllerStub, 'howdy', 'cool');
      expect(result.something).toBe(true);
    } catch (e) { throw e; }
  });
  it('sets up the page but finds nothing', async () => {
    let result;
    controllerStub.app.httpClient.fetch = function fetch() { return Promise.resolve(null); };
    try {
      result = await utils.setupPage(controllerStub, 'howdy', 'cool');
      expect(result).toBe(null);
    } catch (e) { throw e; }
  });
  it('tries to set up the page but catches error', async () => {
    controllerStub.app.httpClient.fetch = function fetch() { return Promise.reject(new Error('bad')); };
    try {
      await utils.setupPage(controllerStub, 'howdy', 'cool');
    } catch (e) { expect(e.message).toBe('bad'); }
  });
  it('starts a slide show', (done) => {
    sMock = sinon.mock(showSlides);
    sMock.expects('showSlides').returns(true);
    utils.startSlides(['1', '2', '3']);
    jest.advanceTimersByTime(5400);
    sMock.restore();
    done();
  });
  it('should test util compareTime functions', () => {
    expect(utils.compareTime('11:07 pm', '10:18 pm')).toBeTruthy();
    expect(utils.compareTime('11:07 pm', '10:18 am')).toBeTruthy();
    expect(utils.compareTime('11:07 pm', '')).toBeFalsy();
    expect(utils.compareTime('11:07 pm', '11:18 pm')).toBeFalsy();
    expect(utils.compareTime('11:37 pm', '11:18 pm')).toBeTruthy();
    expect(utils.compareTime('10:37 pm', '11:18 pm')).toBeTruthy();
  });
  it('should format a 12hr time', () => {
    expect(utils.getTime(13, 30)).toBe('1:30 pm');
    expect(utils.getTime(11, 30)).toBe('11:30 am');
    expect(utils.getTime(0, 20)).toBe('12:20 am');
  });
  it('should format a datetime', () => {
    utils.formatDate(new Date());
    utils.fixDates(event);
  });
  it('should mark past dates', () => {
    utils.markPast(event, utils.formatDate);
  });
  it('makes a tab delimted text file', async () => {
    let cb;
    const fMock = sinon.mock(filesaver);
    fMock.expects('saveAs').resolves(true);
    try {
      cb = await utils.makeCSVfile({ fetch() { return Promise.resolve({ json() { return Promise.resolve({}); } }); } }, '', '');
      expect(cb).toBe(true);
    } catch (e) { throw e; }
    fMock.restore();
  });
  it('should mark filter dropdown', () => {
    utils.makeFilterDropdown([], [{ attrib: 'hello' }], 'attrib');
  });
  it('should show checkboxes', () => {
    document.body.innerHTML = '<div class="errorMessage"></div><div id="delete" style="display: block;"></div>';
    utils.showCheckboxes('delete', true);
    utils.showCheckboxes('delete', false);
  });
});
