<template>
    <select :value="parent.value" :name="parent.name" :id="parent.name" @input="$emit('update:modelValue', $event.target.value)">
        <option v-for="(o, j) in parent.options" :value="o.value" :key="o.title + '-' + j">
            {{ o.title }}
        </option>
    </select>
</template>
  
<script setup>
const props = defineProps({
    parent: Object,
    modelValue: [String, Number]
});

const emit = defineEmits(["update:modelValue"]);
</script>
  
 