<template>
    <label :for="parent.name">{{ parent.label }}</label>
    <div v-for="(option, j) in parent.options" :key="option.title + '-' + j">
        <InputCheckbox :parent="option" :value="option.value" :modelValue="modelValue"
            @update:modelValue="e => handleCheckboxGroup(e, i, j, parent.name, option)" />
    </div>
    <slot></slot>
</template>
  
<script setup>
const props = defineProps({
    parent: Object,
    modelValue: [Array]
});

const emit = defineEmits(["update:modelValue", "changed"]);

const handleCheckboxGroup = (e, i, j, parentName, option) => {
    // console.log('input', e, parentName, option)
    if (e instanceof Array) {
        // final.value[i].value = e
        // onChange(final.value[i].value, parentName, option)
        // props.modelValue = e
        emit('update:modelValue', e)
        emit('changed', e)
    }
    // else {
    //     const isChecked = e.target.checked
    //     final.value[i].options[j]._value = isChecked ? option.value : false
    //     onChange(final.value[i].options, parentName, option)
    // }
}

// const test1 = (e) => {
//     console.log('input', e.target.value)
// }

// const test2 = (e) => {
//     console.log('change', e.target.value)
// }

</script>
  
 