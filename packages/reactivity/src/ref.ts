import { activeEffect, trackEffect, triggerEffects } from './effect'
import { toReactive } from './reactive'
import { createDep } from './reactiveEffect'

// ref shallowRef
export function ref(value) {
  return createRef(value)
}

function createRef(value) {
  return new RefImpl(value)
}

class RefImpl {
  __v_isRef = true
  // 用来保存ref的值
  _value
  // 用于收集对应的effect
  dep
  constructor(public rawValue) {
    this._value = toReactive(rawValue)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newValue) {
    if (newValue !== this.rawValue) {
      this.rawValue = newValue
      this._value = newValue
      triggerRefValue(this)
    }
  }
}

function trackRefValue(ref) {
  if (activeEffect) {
    ref.dep ??= createDep(() => (ref.dep = undefined), 'undefined')
    trackEffect(activeEffect, ref.dep)
  }
}
function triggerRefValue(ref) {
  const dep = ref.dep
  // 触发依赖更新
  if (dep) triggerEffects(dep)
}
