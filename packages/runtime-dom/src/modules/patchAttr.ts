export const patchAttr = (el, key, value) => {
  if (value) {
    el.setAttribute(key, value)
  } else {
    el.removeAttribute(key)
  }
}
