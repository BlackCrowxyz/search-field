<template>
    <label :for="parent.name">{{ parent.label }}</label>
    <input :type="parent.type" :value="parent.value" @input="$emit('update:modelValue', $event.target.value)"/>
</template>
  
<script setup>
const props = defineProps({
    parent: Object,
    modelValue: [String, Number]
});

const emit = defineEmits(["update:modelValue"]);
</script>
  
 