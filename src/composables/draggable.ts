import { ref, onMounted, onUpdated, watch, type ModelRef, type Ref } from 'vue'
import { type DraggableItem } from '@/types'
import { changeArrayOrder } from '@/utils/change-order'
import { getIdGenerator } from '@/utils/id-generator'
import { throttle } from '@/utils/throttle'
import { toOriginalArray, toDraggableItems } from '@/utils/to-draggable-items'

let itemCurrentlyDragging = ref<DraggableItem<any>>()
let containerIdCurrentlyDraggedOver = ref(0)
let transitioning = false
const containerIdGenerator = getIdGenerator()

function useDraggableContainer<T>(originalItems: ModelRef<Array<T>>): {
  id: number
  items: Ref<Array<DraggableItem<T>>>
  onDragOver: () => void
  onItemDragOver: (value: { position: number }) => void
} {
  const id = containerIdGenerator()
  const items = ref<Array<DraggableItem<T>>>(toDraggableItems(originalItems.value))

  // update v-model when dropped
  watch(itemCurrentlyDragging, () => {
    if (itemCurrentlyDragging.value) return
    originalItems.value = toOriginalArray(items.value) as typeof originalItems.value
  })

  // case when an item is being dragged to another container
  watch(containerIdCurrentlyDraggedOver, () => {
    if (containerIdCurrentlyDraggedOver.value === id) {
      return
    }
    items.value = items.value.filter(
      (item) => item.id !== itemCurrentlyDragging.value?.id
    )
  })

  // when an item is moved to an empty container
  const onDragOver = () => {
    if (
      transitioning ||
      !itemCurrentlyDragging.value ||
      containerIdCurrentlyDraggedOver.value === id
    ) {
      return
    }

    if (items.value.length > 0) {
      return
    }

    containerIdCurrentlyDraggedOver.value = id
    items.value = [itemCurrentlyDragging.value]
  }

  // handle event emitted from draggableItem
  const onItemDragOver = ({ position }: { position: number }) => {
    if (transitioning || !itemCurrentlyDragging.value) return

    items.value = changeArrayOrder(
      items.value,
      itemCurrentlyDragging.value,
      position
    )
  }

  return {
    id,
    items: items as Ref<Array<DraggableItem<T>>>,
    onDragOver,
    onItemDragOver,
  }
}

const useDraggableItem = (
  item: Ref<any>,
  position: Ref<number>,
  containerId: Ref<number>,
  handler: (value: { position: number }) => void
) => {
  const draggableItemEl = ref({} as Element)
  const isDragging = ref(
    item.value.id === itemCurrentlyDragging.value?.id ? true : false
  )
  const middleY = ref<number>(0)

  onMounted(async () => {
    const box = draggableItemEl.value.getBoundingClientRect()
    middleY.value = box.top + box.height / 2
  })

  onUpdated(() => {
    const box = draggableItemEl.value.getBoundingClientRect()
    middleY.value = box.top + box.height / 2
  })

  const onDragStart = () => {
    itemCurrentlyDragging.value = item.value
    containerIdCurrentlyDraggedOver.value = containerId.value
    isDragging.value = true
  }

  const onDragEnd = () => (itemCurrentlyDragging.value = undefined)
  const onDragOver = throttle((e: DragEvent) => {
    if (item.value.id === itemCurrentlyDragging.value?.id) return

    if (containerIdCurrentlyDraggedOver.value !== containerId.value) {
      containerIdCurrentlyDraggedOver.value = containerId.value
    }

    const offset = middleY?.value || 0 - e.clientY

    handler({
      position: offset > 0 ? position.value : position.value + 1,
    })
  }, 50)

  const transitionStart = () => (transitioning = true)
  const transitionEnd = () => (transitioning = false)
  watch(itemCurrentlyDragging, () => {
    if (itemCurrentlyDragging.value) return

    isDragging.value = false
  })

  return {
    draggableItemEl,
    isDragging,
    onDragStart,
    onDragOver,
    onDragEnd,
    transitionStart,
    transitionEnd,
  }
}

export { useDraggableContainer, useDraggableItem }
