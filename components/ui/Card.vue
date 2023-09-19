<template>
  <div :class="styles.box">
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  border: { type: Boolean, default: false },
});

const styles = {
  box: "bg-white rounded-md p-3 mx-2",
};
if (props.border) styles.box += " border border-indigo-600 mx-n4 px-n6 my-4";
</script>
