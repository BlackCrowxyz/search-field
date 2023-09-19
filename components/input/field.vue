<template>
    <label dir="auto" :class="styles.label" :for="parent.name">{{ parent.label }}</label>

    <input v-if="parent.type != 'textarea'" dir="auto" :class="styles.input" :type="parent.type" :value="parent.value"
        @input="$emit('update:modelValue', $event.target.value)" />
    <textarea v-else dir="auto" :class="styles.input" :value="parent.value"
        @input="$emit('update:modelValue', $event.target.value)" />
    <slot></slot>
</template>
  
<script setup>
const props = defineProps({
    parent: Object,
    modelValue: [String, Number]
});

const styles = {
    label: "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
    input: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
}

const emit = defineEmits(["update:modelValue"]);
</script>
  
 