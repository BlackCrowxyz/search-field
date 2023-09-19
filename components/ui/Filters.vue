<template>
  <UiCard>
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
    <div :class="styles.box">
      <slot></slot>
    </div>
  </UiCard>
</template>

<script setup>
const emit = defineEmits(["clearAll"]);

const styles = {
  box: "flex flex-wrap justify-end rounded-md bg-white p-3 mx-2",
};
</script>
