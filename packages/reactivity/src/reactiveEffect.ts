import { activeEffect } from './effect'

export function track(target, key) {
  if (activeEffect) {
    console.log('track', key, activeEffect)
  }
}
