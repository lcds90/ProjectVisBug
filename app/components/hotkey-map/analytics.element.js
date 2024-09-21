import { HotkeyMap } from './base.element'
import { analytics as icon } from '../vis-bug/vis-bug.icons'

export class AnalyticsHotkeys extends HotkeyMap {
  constructor() {
    super()

    this._hotkey    = 'w'
    this._usedkeys  = []
    this.tool       = 'analytics'
  }

  show() {
    this.$shadow.host.style.display = 'flex'
  }

  render() {
    return `
      <article>
        <div tool-icon>
          <span>
            ${icon}
            ${this._tool} Tool
          </span>
        </div>
        <div command>
          coming soon
        </div>
      </article>
    `
  }
}

customElements.define('hotkeys-analytics', AnalyticsHotkeys)
