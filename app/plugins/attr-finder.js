import {
  isFixed,
  colors,
  numberBetween
} from '../utilities/'

export const commands = [
  'attr finder',
  'lcds90',
]

export const description = 'find specific attributes for web analytics metrics!'

export default async function ({ selected, params }) {
  const webComponentDebugger = document.querySelector('vis-bug')
  const getCopyButton = webComponentDebugger.$shadow.querySelector('#copy-all')
  console.dir(webComponentDebugger)
  if (getCopyButton) getCopyButton.remove()

  const findPastElHovers = document.querySelectorAll('visbug-hover')
  findPastElHovers.forEach(el => el.remove())

  if (!params) {
    console.log('Add attributes to search as parameters between %c{}', "font-size: 0.75rem; color: lightgreen;")
    console.log('Examples: /attr finder %c{[data-test]} {[data-track]}', "font-size: 0.75rem; color: lightgreen;")
    const tooltip = document.createElement('div')
    tooltip.id = 'attr-finder-tooltip'
    tooltip.style = `
          position: fixed;
    background: grey;
    color: white;
    bottom: 6px;
    left: 260px;
    width: max-content;
    border-radius: 4px;
    padding: 4px;
    cursor: default;
    font-size: 0.75rem;
    `
    tooltip.innerHTML = `
      Add attributes to search as parameters between {} <br>
      Examples: /attr finder {[data-test]} {[data-track]} <br>
      See more about <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector" target="_blank">querySelector</a>
    `
    webComponentDebugger.$shadow.querySelector('input[type=search]').insertAdjacentElement('afterend', tooltip)
    return
  }
  const getTooltipEl = webComponentDebugger.$shadow.querySelector('#attr-finder-tooltip')
  if (getTooltipEl) getTooltipEl.remove()

  const allSelectors = []
  const contentCopy = `
  <svg height="24" viewBox="0 0 24 24" width="24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
  </svg>
`

  const findEls = (el, querySelector) => {
    const selectorsListWithValueToSearch = []
    const attr = querySelector.replace('[', '').replace(']', '')
    const color = colors[numberBetween(0, colors.length)];

    Array.from(el.querySelectorAll(querySelector))
      .filter(el => el.nodeName !== 'VIS-BUG')
      .forEach(el => {
        const label = document.createElement('visbug-label')
        const attrValue = el.getAttribute(attr)
        const attrToCopy = `[${attr}="${attrValue}"]`;
        label.text = `${contentCopy} ${attrToCopy}`
        label.position = {
          boundingRect: el.getBoundingClientRect(),
          isFixed: isFixed(el),
        }

        label.style.setProperty('cursor', 'pointer')
        label.style.setProperty(`--label-bg`, color)

        label.$shadow.firstChild.style.setProperty('display', 'flex')
        label.$shadow.firstChild.style.setProperty('align-items', 'center')
        label.$shadow.firstChild.style.setProperty('justify-content', 'center')
        label.addEventListener('click', () => {
          navigator.clipboard.writeText(attrToCopy)
        })

        label.title = `Click to copy ${attr}="${attrValue}" to your clipboard.`

        const overlay = document.createElement('visbug-hover')
        overlay.position = { el }
        overlay.style.setProperty(`--hover-stroke`, color)
        overlay.style.setProperty(`--position`, isFixed(el) ? 'fixed' : 'absolute')

        document.body.appendChild(label)
        document.body.appendChild(overlay)

        selectorsListWithValueToSearch.push(attrToCopy)
      })

    if (selectorsListWithValueToSearch.length > 0) {
      console.groupCollapsed(`%chits: ${attr}: ${selectorsListWithValueToSearch.length}`, `color: ${color}; font-size: 0.75rem;`)
      console.log(selectorsListWithValueToSearch)
      selectorsListWithValueToSearch.forEach((selector) => {
        console.log(`%c${selector}`, "color: lightgreen; font-size: 0.75rem;")
      })
      console.groupEnd()
      allSelectors.push(...selectorsListWithValueToSearch)
    }
  }
  const elements = selected.length > 0 ? Array.from(selected) : [document.body]

  if (!elements) return;
  elements.forEach((element) => {
    params.forEach((param) => {
      findEls(element, param)
    })
    const copyAllButton = webComponentDebugger.$shadow.querySelector('ol[colors] li#border').cloneNode()

    copyAllButton.id = 'copy-all'
    copyAllButton.style.setProperty('background', 'orange')
    copyAllButton.style.setProperty('cursor', 'pointer')
    copyAllButton.style.setProperty('display', 'flex')
    copyAllButton.title = 'Click to copy all selectors to your clipboard.'
    copyAllButton.innerHTML = `
      ${contentCopy}
      `
    webComponentDebugger.$shadow.querySelector('ol[colors]').appendChild(copyAllButton)
    copyAllButton.addEventListener('click', () => {
      navigator.clipboard.writeText(allSelectors.join('\n'))
    })
  })


}