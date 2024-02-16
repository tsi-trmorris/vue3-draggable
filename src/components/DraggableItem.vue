<template>
  <div
    draggable="true"
    @transitionStart="transitionStart"
    @transitionEnd="transitionEnd"
    @dragover.prevent.stop="onDragOver"
    @dragstart.stop="onDragStart"
    @dragend.stop="onDragEnd"
    @dragenter.prevent
    ref="draggableItemEl"
    :class="{ isDragging }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useDraggableItem } from '../composables/draggable'

const props = defineProps<{
  item: any
  position: number
  containerId: number
}>()

const emit = defineEmits<{
  itemDragOver: [value: { position: number }]
}>()

const { item, position, containerId } = toRefs(props)

const emitItemDragOver = (val: { position: number }) => {
  emit('itemDragOver', val)
}

const {
  draggableItemEl,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
  transitionStart,
  transitionEnd,
} = useDraggableItem(item, position, containerId, emitItemDragOver)
</script>

<style scoped>
.isDragging {
  opacity: 0.4;
}
</style>
