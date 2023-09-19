<template>
  <div
    class="bg-slate-100 p-8 rounded-md"
    :class="{ 'rounded-s-md border mx-10': inside, 'mx-6 mt-6': !inside }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  inside: { type: [Boolean], default: false },
});
</script>
