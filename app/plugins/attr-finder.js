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

export default async function ({ selected, params, query }) {
  console.group('attrFinder')
  console.log(query, params, selected)
  console.groupEnd()

  if (!params) {
    console.log('Add parameters with --')
    return
  }

  const findEls = (el, querySelector) => {
    Array.from(el.querySelectorAll(querySelector))
      .filter(el => el.nodeName !== 'VIS-BUG')
      .forEach(el => {
        const color = colors[numberBetween(0, colors.length)];
        const label = document.createElement('visbug-label')
        const attr = querySelector.replace('[', '').replace(']', '')
        const attrValue = el.getAttribute(attr)
        label.text = `${attr}: ${attrValue}`
        label.position = {
          boundingRect: el.getBoundingClientRect(),
          isFixed: isFixed(el),
        }
        label.style.setProperty(`--label-bg`, color)

        const overlay = document.createElement('visbug-hover')
        overlay.position = { el }
        overlay.style.setProperty(`--hover-stroke`, color)
        overlay.style.setProperty(`--position`, isFixed(el) ? 'fixed' : 'absolute')

        document.body.appendChild(label)
        document.body.appendChild(overlay)
      })
  }
  const elements = selected.length > 0 ? selected : [document.body]
  Array.from(elements.forEach((element) => {
    params.forEach((param) => {
      findEls(element, param)
    })
  }))


}