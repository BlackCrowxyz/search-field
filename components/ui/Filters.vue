<template>
  <UiCard class="mt-10">
    <label class="flex">
      <span class="mr-3"> Filters </span>
      <UiBadge
        @click="emit('clearAll')"
        color="bg-red-400 hover:bg-red-500 focus:ring-red-300"
      >
        Clear All Filters
      </UiBadge>
    </label>
    <br />
    <div class="flex flex-wrap justify-end rounded-md bg-white p-3 mx-2">
      <slot></slot>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
const emit = defineEmits(["clearAll"]);
</script>
