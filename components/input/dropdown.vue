<template>
  <div class="flex justify-end items-center">
    <select
      :class="styles.select"
      :value="parent.value"
      :name="parent.name"
      :id="parent.name"
      @input="$emit('update:modelValue', $event.target.value)"
    >
      <option
        v-for="(option, j) in parent.options"
        :value="option.value"
        :key="option.title + '-' + j"
      >
        {{ option.title }}
      </option>
    </select>
    <label dir="auto" :class="styles.label" :for="parent.name">
      {{ parent.label }}
    </label>
  </div>
  <slot></slot>
</template>

<script setup>
const props = defineProps({
  parent: Object,
  modelValue: [String, Number],
});

const emit = defineEmits(["update:modelValue"]);

const styles = {
  label:
    "mb-2 mx-2 text-sm font-medium text-gray-900 dark:text-white min-w-[70px]",
  select:
    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
};
</script>
