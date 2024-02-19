import type { DraggableItem } from '@/types'

export function changeArrayOrder<T>(
  arr: Array<DraggableItem<T>>,
  target: DraggableItem<T>,
  newIndexOfTarget: number
): Array<DraggableItem<T>> {
  let newArr = arr.filter((e) => e.id !== target.id)
  newArr.splice(newIndexOfTarget, 0, { ...target })
  return newArr
}
