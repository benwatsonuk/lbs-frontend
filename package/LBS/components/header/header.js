(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('LBSFrontend', factory) :
	(global.LBSFrontend = factory());
}(this, (function () { 'use strict';

/**
 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 */
function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes);
  }
}

const settings = {
  minWidth: '40.0625em',
  desktop: '48.0625em'
};

// New bits

function Header ($module) {
  this.$module = $module;
  this.$navigationToggle = this.$module.querySelector('#super-navigation-menu-toggle');
  this.$navigationMenu = this.$module.querySelector('#super-navigation-menu');
  this.$searchToggle = this.$module.querySelector('#super-search-menu-toggle');
  this.$searchMenu = this.$module.querySelector('#super-search-menu');
  this.$buttons = this.$module.querySelectorAll('button[aria-controls][data-toggle-mobile-group][data-toggle-desktop-group]');
  this.$menuButtons = this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__navigation-item');
  this.$phaseBanner = document.querySelector('.lbs-row--phase-banner');
  this.$header = document.querySelector('.lbs-header');
  // this.$menuButtons = this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__navigation-second-toggle-button')
  this.hiddenButtons = this.$module.querySelectorAll('button[hidden]');
  this.menuOpen = false;
  this.searchOpen = false;
  this.lastWindowSize = null;
}

Header.prototype.init = function () {
  if (!this.$module) {
    return
  }
  this.$module.classList.add('js-module-initialised');
  if (typeof window.matchMedia === 'function') {
    this.setupResponsiveChecks();
  }
};

Header.prototype.setupResponsiveChecks = function () {
  this.mql = window.matchMedia('(min-width: ' + settings.desktop + ')');
  this.mql.addListener(this.checkMode.bind(this));
  this.checkMode();
};

Header.prototype.checkMode = function () {
  if (this.mql.matches) {
    this.teardownMobileMenu();
    this.setupDesktopMenu();
  } else {
    this.teardownDesktopMenu();
    this.setupMobileMenu();
  }
};

Header.prototype.setupMobileMenu = function () {
  this.setAttributes('mobile');
  if (this.$navigationMenu != null) {
    this.$navigationToggle.boundMenuClick = this.handleMenuButtonClick.bind(this);
    this.$navigationToggle.addEventListener('click', this.$navigationToggle.boundMenuClick, true);
  }
  if (this.$searchMenu != null) {
    this.$searchToggle.boundSearchClick = this.handleSearchButtonClick.bind(this);
    this.$searchToggle.addEventListener('click', this.$searchToggle.boundSearchClick, true);
  }
};

Header.prototype.teardownMobileMenu = function () {
  this.unsetAttributes('mobile');
  if (this.$navigationMenu != null) {
    this.$navigationToggle.removeEventListener('click', this.$navigationToggle.boundMenuClick, true);
  }
  if (this.$searchMenu != null) {
    this.$searchToggle.removeEventListener('click', this.$searchToggle.boundSearchClick, true);
  }
};

Header.prototype.setupDesktopMenu = function () {
  this.setAttributes('desktop');
  if (this.$searchMenu != null) {
    this.$searchToggle.boundSearchClick = this.handleSearchButtonClick.bind(this);
    this.$searchToggle.addEventListener('click', this.$searchToggle.boundSearchClick, true);
  }
};

Header.prototype.teardownDesktopMenu = function () {
  this.unsetAttributes('desktop');
  if (this.$navigationMenu != null) {
    this.$navigationToggle.removeEventListener('click', this.$navigationToggle.boundMenuClick, true);
  }
  if (this.$searchMenu != null) {
    this.$searchToggle.removeEventListener('click', this.$searchToggle.boundSearchClick, true);
  }
};

Header.prototype.menuItemClick = function (e) {
  const theTargetID = e.target.getAttribute('aria-controls');
  e.target.classList.toggle('gem-c-layout-super-navigation-header__open-button');
  this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__navigation-second-toggle-button:not([aria-controls=' + theTargetID + '])').forEach(i => i.classList.remove('gem-c-layout-super-navigation-header__open-button'));
  const theTarget = document.getElementById(theTargetID);
  this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__navigation-dropdown-menu:not(#' + theTargetID + ')').forEach(i => i.setAttribute('hidden', true));
  document.getElementById(theTargetID).getAttribute('hidden') != null ? document.getElementById(theTargetID).removeAttribute('hidden') : document.getElementById(theTargetID).setAttribute('hidden', 'true');
  if (this.mql.matches === true) {
    this.$module.style.marginBottom = theTarget.offsetHeight + 'px';
  }
  if (this.$searchMenu != null) {
    this.closeSearch(this.$searchToggle, this.$searchMenu);
  }
};

Header.prototype.setAttributes = function ($type) {
  if ($type === 'mobile') {
    if (this.$navigationMenu != null) {
      this.$navigationToggle.removeAttribute('hidden');
      this.$navigationToggle.setAttribute('aria-expanded', false);
      this.$navigationMenu.setAttribute('hidden', true);
    }
  }
  if (this.$searchMenu != null) {
    this.$searchMenu.setAttribute('hidden', true);
    this.$searchToggle.setAttribute('aria-expanded', false);
    this.$searchToggle.setAttribute('aria-label', 'Show search menu');
    this.$module.querySelector('.gem-c-layout-super-navigation-header__search-item-link').setAttribute('hidden', true);
    this.$module.querySelector('.gem-c-layout-super-navigation-header__search-and-popular').removeAttribute('hidden');
    this.$searchToggle.removeAttribute('hidden');
  }
  nodeListForEach(this.$menuButtons, function ($button) {
    $button.querySelector('.gem-c-layout-super-navigation-header__navigation-item-link').setAttribute('hidden', true);
    $button.querySelector('.gem-c-layout-super-navigation-header__navigation-second-toggle-button').removeAttribute('hidden');
    // Save bounded functions to use when removing event listeners during teardown
    $button.boundMenuItemClick = this.menuItemClick.bind(this);
    // Handle events
    $button.querySelector('button').addEventListener('click', $button.boundMenuItemClick, true);
  }.bind(this));
};

Header.prototype.unsetAttributes = function ($type) {
  if ($type === 'mobile') {
    if (this.$navigationMenu != null) {
      this.$navigationToggle.setAttribute('hidden', true);
      this.$navigationMenu.removeAttribute('hidden');
    }
    if (this.$searchMenu != null) {
      this.$searchToggle.setAttribute('hidden', true);
      this.$searchMenu.removeAttribute('hidden');
    }
  }
  this.$module.style.marginBottom = '0px';
  this.searchOpen = false;
  this.menuOpen = false;
  if (this.$navigationMenu != null) {
    this.closeDesktopMenus();
  }
  if (this.$searchMenu != null) {
    this.$searchToggle.classList.remove('gem-c-layout-super-navigation-header__open-button');
  }
  nodeListForEach(this.$menuButtons, function ($button) {
    $button.querySelector('button').removeEventListener('click', $button.boundMenuItemClick, true);
  });
};

Header.prototype.handleMenuButtonClick = function () {
  if (this.menuOpen === true) {
    this.closeMenu(this.$navigationToggle, this.$navigationMenu);
  } else {
    this.openMenu(this.$navigationToggle, this.$navigationMenu);
  }
};

Header.prototype.handleSearchButtonClick = function () {
  if (this.searchOpen === true) {
    this.closeSearch(this.$searchToggle, this.$searchMenu);
    if (this.mql.matches === true) {
      this.$module.style.marginBottom = '0';
      // this.$searchMenu.style.top = '0'
    }
  } else {
    this.openSearch(this.$searchToggle, this.$searchMenu);
    if (this.mql.matches === true) {
      this.$module.style.marginBottom = this.$searchMenu.offsetHeight + 'px';
      // this.$searchMenu.style.top = this.$navigationMenu.offsetHeight + 'px'
      if (this.$phaseBanner) {
        this.$searchMenu.style.bottom = this.$phaseBanner.offsetHeight + 'px';
      }
    }
  }
};

Header.prototype.openMenu = function ($button, $target) {
  this.menuOpen = true;
  $button.classList.add('gem-c-layout-super-navigation-header__open-button');
  $button.setAttribute('aria-expanded', !0);
  $button.setAttribute('aria-label', 'Hide navigation menu');
  $button.classList.add('gem-c-layout-super-navigation-header__open-button');
  $target.removeAttribute('hidden');
  if (this.$searchMenu != null) {
    this.closeSearch(this.$searchToggle, this.$searchMenu);
  }
};

Header.prototype.closeMenu = function ($button, $target) {
  this.menuOpen = false;
  this.$module.style.marginBottom = '0px';
  if (this.$navigationMenu != null) {
    $button.classList.remove('gem-c-layout-super-navigation-header__open-button');
    $button.setAttribute('aria-expanded', !1);
    $button.setAttribute('aria-label', 'Show navigation menu');
    $button.classList.remove('gem-c-layout-super-navigation-header__open-button');
    $target.setAttribute('hidden', !0);
  }
};

Header.prototype.closeDesktopMenus = function () {
  this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__navigation-dropdown-menu').forEach(x => x.setAttribute('hidden', true));
};

Header.prototype.openSearch = function ($button, $target) {
  this.searchOpen = true;
  $button.setAttribute('aria-expanded', !0);
  $button.setAttribute('aria-label', 'Hide navigation menu');
  this.$module.querySelectorAll('.gem-c-layout-super-navigation-header__open-button').forEach(x => x.classList.remove('gem-c-layout-super-navigation-header__open-button'));
  $button.classList.add('gem-c-layout-super-navigation-header__open-button');
  $target.removeAttribute('hidden');
  document.getElementById('lbs-search__box').focus();
  if (this.mql.matches !== true) {
    this.closeMenu(this.$navigationToggle, this.$navigationMenu);
  } else {
    this.closeDesktopMenus();
  }
};

Header.prototype.closeSearch = function ($button, $target) {
  this.searchOpen = false;
  $button.setAttribute('aria-expanded', !1);
  $button.setAttribute('aria-label', 'Show navigation menu');
  $button.classList.remove('gem-c-layout-super-navigation-header__open-button');
  $target.setAttribute('hidden', !0);
};

return Header;

})));
