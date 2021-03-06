import { ShowMore, settings } from '../../common'

function Card ($module) {
  this.$module = $module
}

// All cards in collection
export function Cards ($module) {
  this.$module = $module
}

/**
 * Initialise Card
 *
 * Check for the presence of cards - if any are
 * missing then there's nothing to do so return early.
 */
Card.prototype.init = function () {
  if (!this.$module) {
    return
  }
  if (this.$module.classList.contains('lbs-card--clickable')) {
    this.handleClickable()
  }
  if (this.$module.querySelector('.js__is-hidden')) {
    this.showAllItems()
  }
}

Card.prototype.handleClickable = function () {
  if (this.$module.querySelector('a') !== null) {
    this.$module.addEventListener('click', () => {
      this.$module.querySelector('a').click()
    })
  }
}

Card.prototype.showAllItems = function () {
  // todo - consider moving focus to previously hidden items on toggle
  const module = this.$module
  const itemCount = this.$module.querySelectorAll('.js__is-hidden').length
  const showMoreHtml = document.createElement('a')
  showMoreHtml.innerText = 'Show more items (' + itemCount + ')'
  showMoreHtml.setAttribute('class', 'show-more-link')
  showMoreHtml.setAttribute('href', '#')
  showMoreHtml.addEventListener('click', function (e) {
    module.querySelector('ul').classList.add('show-hidden')
    module.removeChild(this)
    e.preventDefault()
  })
  this.$module.append(showMoreHtml)
}

/**
 * Initialise Cards
 *
 * Check for the presence of card wrappers - if any are
 * present, perform common actions such as setting common heights
 */

Cards.prototype.init = function () {
  if (!this.$module) {
    return
  }
  if (typeof window.matchMedia === 'function') {
    this.setupResponsiveChecks()
  } else {
    this.setupCardWrapper()
  }
  if (this.$module.getAttribute('data-show-more')) {
    new ShowMore(this.$module).init()
  }
}

Cards.prototype.setupCardWrapper = function () {

}

Cards.prototype.setupResponsiveChecks = function () {
  this.mql = window.matchMedia('(min-width: ' + settings.minWidth + ')')
  this.mql.addListener(this.checkMode.bind(this))
  const that = this
  this.checkMode()
  window.onresize = function () {
    that.checkMode()
  }
}

Cards.prototype.checkMode = function () {
  if (this.mql.matches) {
    this.setHeight()
    this.setupCardWrapper()
  } else {
    this.teardownCards()
  }
}

Cards.prototype.teardownCards = function () {
  document.querySelectorAll('.lbs-card:not(.lbs-card--popular-item)').forEach(x => {
    x.removeAttribute('style')
  })
}

Cards.prototype.setHeight = function () {
  // todo - consider adding parameter to ignore certain items (opt in)
  let tallestCard = 0
  this.$module.querySelectorAll('.lbs-card').forEach(card => {
    card.style.minHeight = '0'
    if (card.offsetHeight > tallestCard) {
      const cs = window.getComputedStyle(card)
      tallestCard = card.offsetHeight - (parseFloat(cs.paddingBottom))
    }
  })
  this.$module.querySelectorAll('.lbs-card').forEach(x => {
    if (x.classList.contains('lbs-card--popular-item')) {
      const cs = window.getComputedStyle(x)
      x.style.minHeight = tallestCard - (parseFloat(cs.paddingBottom)) + 'px'
    } else {
      x.style.minHeight = tallestCard + 'px'
    }
  })
}

export default Card
