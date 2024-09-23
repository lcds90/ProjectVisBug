import $ from 'blingblingjs'
import hotkeys from 'hotkeys-js'
import { querySelectorAllDeep } from 'query-selector-shadow-dom'
import { PluginRegistry, PluginHints } from '../../plugins/_registry.js'
import { notList } from '../../utilities/index.js'
import { isFirefox } from '../../utilities/cross-browser.js'
import { contentCopy, download, upload } from '../../components/vis-bug/vis-bug.icons.js'

let SelectorEngine

const selectorsInLocalStorage = JSON.parse(localStorage.getItem('selectors') || '[]')

// create input
const search_base = document.createElement('div')
search_base.classList.add('search')
search_base.innerHTML = `
  <input list="visbug-web-analytics-list" type="search" placeholder="Enter the attribute to find"/>
  <datalist id="visbug-web-analytics-list">
    ${selectorsInLocalStorage.reduce((options, selector) =>
      options += isFirefox > 0
        ? `<option value="${selector}">`
        : `<option value="${selector}">${selector}`
    , '')}
  </datalist>
  
`

const buttonShowNotMapped = document.createElement('div')
buttonShowNotMapped.classList.add('analytics')
buttonShowNotMapped.innerHTML = `
        <button class="load" title="Carregar pré-definição de seletores">
          ${upload}
        </button>
        <button class="analytics-download" title="Baixar seletores">
        ${download}
        </button>
        <button class="analytics-copy-all" title="Copiar seletores" disabled>
          ${contentCopy}
        </button>
`
search_base.appendChild(buttonShowNotMapped)

const search        = $(search_base)
const searchInput = $('input', search_base)

const showSearchBar = () => search.attr('style', 'display:block')
const hideSearchBar = () => search.attr('style', 'display:none')
const stopBubbling  = e => e.key != 'Escape' && e.stopPropagation()

export function Analytics({ node }) {
  if (node) node[0].appendChild(search[0])

  const onQuery = e => {
    e.preventDefault()
    e.stopPropagation()

    const query = e.target.value

    window.requestIdleCallback(_ =>
      queryPage(query))
  }

  const focus = e =>
    searchInput[0].focus()

  searchInput.on('click', focus)
  searchInput.on('input', onQuery)
  searchInput.on('keydown', stopBubbling)
  // searchInput.on('blur', hideSearchBar)

  showSearchBar()
  focus()

  // hotkeys('escape,esc', (e, handler) => {
  //   hideSearchBar()
  //   hotkeys.unbind('escape,esc')
  // })

  return () => {
    hideSearchBar()
    searchInput.off('oninput', onQuery)
    searchInput.off('keydown', stopBubbling)
    searchInput.off('blur', hideSearchBar)
  }
}

export function provideSelectorEngine(Engine) {
  SelectorEngine = Engine
}

export function queryPage(query) {
/* 
  const webComponentDebugger = document.querySelector('vis-bug')
  const getCopyButton = webComponentDebugger.$shadow.querySelector('#copy-all')
  const getTooltipEl = webComponentDebugger.$shadow.querySelector('#attr-finder-tooltip')
  if (getTooltipEl) getTooltipEl.remove()
  if (getCopyButton) getCopyButton.remove()

  const findPastElHovers = document.querySelectorAll('visbug-hover')
  findPastElHovers.forEach(el => el.remove()) */
/* 
  if (!params) {
    console.log('Add attributes to search as parameters between %c{}', "font-size: 0.75rem; color: lightgreen;")
    console.log('Examples: /attr finder %c{[data-test]} {[data-track]}', "font-size: 0.75rem; color: lightgreen;")
    return
  }

  console.log(params)
  if (params[0].includes("!help")) {
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
    return;
  }
 */
  /* const allSelectors = []
 
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
      allSelectors.push({ [attr]: selectorsListWithValueToSearch })
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
      console.log(allSelectors)

      const result = allSelectors.reduce((acc, obj, index) => {
        const [key, values] = Object.entries(obj)[0]; // Pega a chave e os valores
        const valuesString = values.join('\n'); // Junta os valores com quebra de linha
        acc += `Attribute: ${key}\n${valuesString}`; // Adiciona ao acumulador
    
        // Adiciona '---' se não for o último objeto
        if (index < allSelectors.length - 1) {
            acc += '\n\n---\n\n';
        }
    
        return acc;
    }, '');

      navigator.clipboard.writeText(result)
    })
  }) */
}

export function queryPageOld(query, fn) {
  // todo: should stash a cleanup method to be called when query doesnt match
  
  // /attr finder {[data-track]} {[data-component]}
  const regex = /\{([^{}]+)\}/g;

  // /attr finder --[data-track] --[data-component]
  //  const regex = /--([^\s]+)/g;
  const match = query.match(regex);
  const queryParamsEnd = query.endsWith('}')
  if (match && queryParamsEnd) {
    // const queryFromMatch = query.split(' --')[0]
    const queryFromMatch = query.split(' {')[0]
    
    if (PluginRegistry.has(queryFromMatch)) {
      const params = match.map((param) => param
        .replaceAll('{', '')
        .replaceAll('}', '')
      )
      return PluginRegistry.get(queryFromMatch)({
        selected: SelectorEngine.selection(),
        query,
        params,
      })
    }
  }

  if (PluginRegistry.has(query))
    return PluginRegistry.get(query)({
      selected: SelectorEngine.selection(),
      query
    })

  if (query == 'links')     query = 'a'
  if (query == 'buttons')   query = 'button'
  if (query == 'images')    query = 'img'
  if (query == 'text')      query = 'p,caption,a,h1,h2,h3,h4,h5,h6,small,date,time,li,dt,dd'

  if (!query) return SelectorEngine.unselect_all()
  if (query == '.' || query == '#' || query.trim().endsWith(',')) return

  try {
    let matches = querySelectorAllDeep(query + notList)
    if (!matches.length) matches = querySelectorAllDeep(query)
    if (matches.length) {
      matches.forEach(el =>
        fn
          ? fn(el)
          : SelectorEngine.select(el))
    }
  }
  catch (err) {}
}
