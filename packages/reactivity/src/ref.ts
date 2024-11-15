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

export function trackRefValue(ref) {
  if (activeEffect) {
    ref.dep ??= createDep(() => (ref.dep = undefined), 'undefined')
    trackEffect(activeEffect, ref.dep)
  }
}
export function triggerRefValue(ref) {
  const dep = ref.dep
  // 触发依赖更新
  if (dep) triggerEffects(dep)
}

// toRef toRefs
class ObjectRefImpl {
  // 增加ref标识
  __v_isRef = true
  constructor(
    public _object,
    public _key
  ) {}

  get value() {
    return this._object[this._key]
  }

  set value(newValue) {
    this._object[this._key] = newValue
  }
}
export function toRef(object, key) {
  return new ObjectRefImpl(object, key)
}
export function toRefs(object) {
  const res = {}
  for (const key in object) {
    res[key] = toRef(object, key)
  }
  return res
}
export function proxyRefs(objectWithRef) {
  return new Proxy(objectWithRef, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      return res.__v_isRef ? res.value : res
    },
    set(target, key, value, receiver) {
      const oldValue = target[key]
      if (oldValue.__v_isRef) {
        oldValue.value = value
        return true
      } else {
        return Reflect.set(target, key, value, receiver)
      }
    },
  })
}

export function isRef(value) {
  return !!value?.__v_isRef
}
