<template>
    <input type="checkbox" :name="parent?.name || parent?.title" :checked="isChecked" :value="parent.value"
    @change="updateInput" />
    <label :for="parent?.name || parent?.title">{{ parent?.label || parent?.title }}</label>
</template>
  
<script setup>
const props = defineProps({
    parent: Object,
    modelValue: { type: [Array, Boolean] },
    value: { type: [Boolean, Number, String, Object] },
    trueValue: { default: true },
    falseValue: { default: false }
});

const state = ref(false)

const emit = defineEmits(["update:modelValue"]);

const isChecked = computed(() => {
    if (props.modelValue instanceof Array) {
        return props.modelValue.includes(props.value)
    }
    // Note that `true-value` and `false-value` are camelCase in the JS
    return props.modelValue === props.trueValue
})

function updateInput(event) {
    let isChecked = event.target.checked
    if (props.modelValue instanceof Array) {
        let newValue = [...props.modelValue]
        // console.log({'props.modelValue':props.modelValue})
        if (isChecked) {
            newValue.push(props.value)
        } else {
            newValue.splice(newValue.indexOf(props.value), 1)
        }
        // console.log('checkbox array', newValue, isChecked, props.modelValue)
        emit('update:modelValue', newValue)
    } else {
        console.log('checkbox simple', isChecked)

        emit('update:modelValue', { target: { value: isChecked ? props.trueValue : props.falseValue }, event })
    }
}
</script>
  
 