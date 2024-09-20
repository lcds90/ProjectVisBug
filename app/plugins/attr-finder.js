export const commands = [
  'attr finder',
  'lcds90',
]

export const description = 'find specific attributes for web analytics metrics!'

export default async function (query) {
  console.group('attrFinder')
  console.log(query)
  console.groupEnd()
  Array.from(document.querySelectorAll('*'))
    .filter(el => el.nodeName !== 'VIS-BUG')
    .forEach(el => {

    })
}