import $ from 'blingblingjs'
import { createClassname, schemeRule } from '../../utilities'
import { draggable } from '../../features'
import { MetatipStyles, MetatipLightStyles, MetatipDarkStyles } from '../styles.store'

export class Analytics extends HTMLElement {

  constructor() {
    super()
    this.$shadow = this.attachShadow({mode: 'closed'})
    this.applyScheme = schemeRule(
      this.$shadow,
      MetatipStyles, MetatipLightStyles, MetatipDarkStyles
    )

    this.observe = this.observe.bind(this)
    this.dispatchQuery = this.dispatchQuery.bind(this)
    this.dispatchUnQuery = this.dispatchUnQuery.bind(this)
  }

  connectedCallback() {
    this.setAttribute('popover', 'manual')
    this.showPopover && this.showPopover()
    this.applyScheme(document.querySelector("vis-bug").getAttribute("color-scheme"))
    $(this.$shadow.host).on('click mouseenter', this.observe)
  }


  disconnectedCallback() {
    this.unobserve()
    this.hidePopover && this.hidePopover()
  }

  dispatchQuery(e) {
    this.$shadow.host.dispatchEvent(new CustomEvent('query', {
      bubbles: true,
      detail:   {
        text:       e.target.textContent,
        activator:  e.type,
      }
    }))
  }

  observe() {
    $('h5 > a', this.$shadow).on('click mouseenter', this.dispatchQuery)

    draggable({
      el: this,
      surface: this.$shadow.querySelector('header'),
      cursor: 'grab',
    })
  }

  unobserve() {
    $('h5 > a', this.$shadow).off('click mouseenter', this.dispatchQuery)
  }

  dispatchUnQuery(e) {
    this.$shadow.host.dispatchEvent(new CustomEvent('unquery', {
      bubbles: true
    }))
    this.unobserve()
    this.teardown()
  }

  set meta(data) {
    this.$shadow.innerHTML = this.render(data)
  }

  render({ el, attrs, description = '', links = [
    { name: 'source', link: 'https://github.com/visjs/vis-network' }
  ] }) {
    return `
      <figure>
        <header>
          <h5>
            <a node>${el.nodeName.toLowerCase()}</a>
            <a>${el.id && '#' + el.id}</a>
          </h5>
          <small>
            ${description}
          </small>
        </header>

        <code>
        ${attrs.reduce((items, item) => `
          ${items}
          <span><span prop>${item.name}</span>:</span>
          <span value>${item.value}</span>
        `, '')}
        </code>
        ${links.length ? `
          <details open>
            <summary>External links</summary>
            <code>${links.reduce((items, item) => `
              ${items}
              <span value><a href="${item.link}" target="_blank">${item.name || item.link}</a></span>
            `, '')}
            </code>
          </details>
        ` : ''}
      </figure>
    `
  }
}

customElements.define('visbug-analytics', Analytics)
