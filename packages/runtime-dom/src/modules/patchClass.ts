export function pathClass(el, value) {
  if (!value) {
    el.removeAttribute('class')
  } else {
    el.className = value
  }
}