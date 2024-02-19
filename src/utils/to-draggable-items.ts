import type { DraggableItem } from '@/types'
import { getIdGenerator } from './id-generator'

const draggableItemIdGenrator = getIdGenerator()

export function toDraggableItems<T>(arr: Array<T>): Array<DraggableItem<T>> {
  return arr.map((e) => ({
    id: draggableItemIdGenrator(),
    data: e,
  }))
}

export function toOriginalArray<T>(arr: Array<DraggableItem<T>>): Array<T> {
  return arr.map((e) => e.data)
}
