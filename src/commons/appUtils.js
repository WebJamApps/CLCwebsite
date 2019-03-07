exports.returnIsWide = function returnIsWide(app, isWide, drawer, drawerParent) {
  const headerText = document.getElementsByClassName('header-text')[0];
  const subT = document.getElementsByClassName('subTitle')[0];
  const elcaLogo = document.getElementById('elcaLogo');
  if (isWide && headerText) {
    headerText.style.fontSize = '34px';
    subT.style.maxWidth = '100%';
    if (elcaLogo !== null) {
      elcaLogo.style.width = '340px';
      elcaLogo.style.paddingTop = '30px';
    }
  }
  if (isWide && drawer) {
    app.contentWidth = app.contentWidth === '0px' ? '220px' : app.contentWidth;
    drawer.style.display = 'block';
    document.getElementsByClassName('swipe-area')[0].style.display = 'none';
    drawerParent.css('display', 'block');
    document.getElementsByClassName('mobile-menu-toggle')[0].style.display = 'none';
    document.getElementsByClassName('nav-list')[0].style.top = '91px';
  } else if (headerText) {
    headerText.style.fontSize = '24px';
    subT.style.maxWidth = '80%';
    document.getElementsByClassName('nav-list')[0].style.top = '0px';
    if (elcaLogo !== null) {
      elcaLogo.style.width = '290px';
      elcaLogo.style.paddingTop = '30px';
      elcaLogo.style.marginLeft = '-2px';
    }
    app.contentWidth = '0px';
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
      drawer.init = 'none';
      drawerParent.css('display', 'none');
      mobileMenuToggle.style.display = 'block';
      swipeArea.style.display = 'block';
    }
  }
  return this.returnIsWide(app, isWide, drawer, drawerParent);
};
