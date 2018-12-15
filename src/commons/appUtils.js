exports.checkUser = async function checkUser(app) {
  let uid;
  if (app.auth.isAuthenticated()) {
    app.authenticated = true; // Logout element is reliant upon a local var;
    try {
      uid = app.auth.getTokenPayload().sub;
    } catch (e) {
      app.logout();
      return Promise.resolve('bad token');
    }
    app.user = await app.appState.getUser(uid);
    if (app.user !== undefined) app.role = app.user.userType;
  }
  return Promise.resolve(true);
};

exports.checkIfLoggedIn = function checkIfLoggedIn(app) {
  const token = localStorage.getItem('aurelia_id_token');
  if (token !== null && token !== undefined) {
    try {
      app.auth.getTokenPayload();
      app.auth.setToken(token);
      app.authenticated = true;
      app.router.navigate('dashboard');
      return true;
    } catch (e) {
      app.logout();
      return false;
    }
  }
  return false;
};

exports.returnIsWide = function returnIsWide(app, isWide, drawer, drawerParent) {
  const headerText = document.getElementsByClassName('header-text')[0];
  const subT = document.getElementsByClassName('subTitle')[0];
  const elcaLogo = document.getElementById('elcaLogo');
  if (isWide && headerText !== undefined) {
    headerText.style.fontSize = '34px';
    subT.style.maxWidth = '100%';
    elcaLogo.style.width = '380px';
    elcaLogo.style.paddingTop = '-20px';
  } else if (isWide && drawer !== null && drawer !== undefined) {
    app.contentWidth = app.contentWidth === '0px' ? '220px' : app.contentWidth;
    drawer.style.display = 'block';
    document.getElementsByClassName('swipe-area')[0].style.display = 'none';
    drawerParent.css('display', 'block');
    document.getElementsByClassName('mobile-menu-toggle')[0].style.display = 'none';
  } else if (headerText !== undefined) {
    headerText.style.fontSize = '24px';
    subT.style.maxWidth = '80%';
    elcaLogo.style.width = '290px';
    elcaLogo.style.paddingTop = '10px';
    elcaLogo.style.marginLeft = '-2px';
  } else {
    app.contentWidth = '0px';
  }
  const mainP = document.getElementsByClassName('main-panel')[0];
  if (mainP !== null && mainP !== undefined) { mainP.style.marginRight = app.contentWidth; }
  return isWide;
};

exports.handleScreenSize = function handleScreenSize(app, isWide, drawerParent) {
  const drawer = document.getElementsByClassName('drawer')[0];
  const mobileMenuToggle = document.getElementsByClassName('mobile-menu-toggle')[0];
  const swipeArea = document.getElementsByClassName('swipe-area')[0];
  if (!app.menuToggled && !isWide) {
    /* istanbul ignore else */
    if (drawer !== null && drawer !== undefined) {
      drawer.style.display = 'none';
      drawerParent.css('display', 'none');
      mobileMenuToggle.style.display = 'block';
      swipeArea.style.display = 'block';
    }
  }
  return this.returnIsWide(app, isWide, drawer, drawerParent);
};

exports.clickFunc = function clickFunc(event) {
  const drawer = document.getElementsByClassName('drawer')[0];
  const toggleIcon = document.getElementsByClassName('mobile-menu-toggle')[0];
  /* istanbul ignore else */
  if (event.target.className !== 'menu-item') {
    document.getElementsByClassName('swipe-area')[0].style.display = 'none';
    drawer.style.display = 'none';
    $(drawer).parent().css('display', 'none');
    toggleIcon.style.display = 'block';
    document.getElementsByClassName('page-host')[0].style.overflow = 'auto';
  }
};
