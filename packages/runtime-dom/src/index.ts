export * from '@vue1/reactivity'

import { nodeOps } from './nodeOps'
import patchProp from './patchProp'

export const renderOptions = Object.assign({ patchProp }, nodeOps)

export function createRenderer() {}
