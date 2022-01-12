function PageGroupNavigation ($module) {
  this.$module = $module
}

PageGroupNavigation.prototype.init = function () {
  if (!this.$module) {
    return
  }
  if (this.$module.querySelectorAll('li').length === 1) {
    this.handleSingleItem()
  }
}

PageGroupNavigation.prototype.handleSingleItem = function () {
  const theItem = this.$module.querySelector('li')
  if (theItem.classList.contains('lbs-page-group__navigation__list-item--next')) {
    this.$module.querySelector('ul').classList.add('lbs-page-group__navigation__list--single-item')
  }
}

export default PageGroupNavigation
