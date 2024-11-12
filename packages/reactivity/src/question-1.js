const person = {
  name: 'jw',
  get aliasName() {
    return this.name + 'handsome'
  },
}

const proxyPerson = new Proxy(person, {
  // receiver是代理对象 target是原始对象
  get(target, key, receiver) {
    console.log('key', key)

    // person.name不会触发 get中的this指向person
    // return target[key]

    // person.aliasName无限循环
    // return receiver[key]

    return Reflect.get(target, key, receiver)
  },
})

console.log('aliasName', proxyPerson.aliasName)
