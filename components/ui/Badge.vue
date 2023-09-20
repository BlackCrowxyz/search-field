<template>
  <div :class="styles.tab">
    <slot></slot>
    <button>
      <IconsClose width="20px" class="pl-1" />
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  color: { type: String, default: "bg-yellow-400 hover:bg-yellow-500" },
});

const styles = reactive({
  tab: "flex justify-end items-center focus:outline-none text-black  focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-3 py-1.5 mr-2 mb-2 dark:focus:ring-yellow-900",
});

styles.tab += " " + props.color;
</script>
