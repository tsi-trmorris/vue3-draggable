<template>
  <div @dragover.prevent.stop="onDragOver">
    <transition-group name="draggable-item-list">
      <draggable-item
        v-for="(item, index) in items"
        :key="item.id"
        :item="item"
        :containerId="id"
        :position="index"
        @itemDragOver="onItemDragOver"
        @dragenter.prevent
      >
        <slot
          name="item"
          :item="item.data"
        ></slot>
      </draggable-item>
    </transition-group>
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed } from 'vue'
import { useDraggableContainer } from '@/composables/draggable'
import DraggableItem from './DraggableItem.vue'

const modelValue = defineModel<T[]>({ default: () => [] })

const props = withDefaults(
  defineProps<{
    transition: string
  }>(),
  {
    transition: '0',
  }
)

const transitionStyle = computed(() => {
  return `transform ${props.transition}ms`
})

const { id, items, onDragOver, onItemDragOver } =
  useDraggableContainer(modelValue)
</script>

<style scoped>
.draggable-item-list-move {
  transition: v-bind(transitionStyle);
}
</style>
