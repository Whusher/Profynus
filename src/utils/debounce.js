/**
 * Simple debounce utility that returns a debounced function with a `cancel` method.
 * @param {Function} fn
 * @param {number} wait
 */
export default function debounce(fn, wait = 300) {
  let timeout = null

  function debounced(...args) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), wait)
  }

  debounced.cancel = () => {
    if (timeout) clearTimeout(timeout)
    timeout = null
  }

  return debounced
}
