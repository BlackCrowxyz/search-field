<template>
    <div v-if="!parent?.options" class="flex justify-end items-start">
        <label :class="styles.label" :for="parent?.name || parent?.title">{{ parent?.label || parent?.title }}</label>
        <input :class="styles.checkbox" type="checkbox" :name="parent?.name || parent?.title" :checked="isChecked"
            :value="parent.value" @change="updateInput" />
    </div>
    <template v-else>
        <label :for="parent.name">{{ parent.label }}</label>
        <div v-for="(option, j) in parent.options" :key="option.title + '-' + j">
            <InputCheckbox :parent="option" :value="option.value" :modelValue="parent.value"
                @update:modelValue="e => $emit('update:modelValue', e)" />
        </div>
    </template>
    <slot></slot>
</template>
  
<script setup>
const props = defineProps({
    parent: Object,
    modelValue: { type: [Array, Boolean] },
    value: { type: [Boolean, Number, String, Object] },
    trueValue: { default: true },
    falseValue: { default: false }
});

const groupCheckbox = reactive([])

const styles = {
    label: "dark:text-blue-500",
    checkbox: "my-auto ml-2 w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
}

const emit = defineEmits(["update:modelValue"]);

const isChecked = computed(() => {
    if (props.modelValue instanceof Array) {
        return props.modelValue.includes(props.value)
    }
    // Note that `true-value` and `false-value` are camelCase in the JS
    return props.modelValue === props.trueValue
})

function updateInput(event) {
    if (event?.length) {
    } else {
        let isChecked = event.target.checked
        if (props.modelValue instanceof Array) {
            let newValue = [...props.modelValue]
            if (isChecked) {
                newValue.push(props.value)
            } else {
                newValue.splice(newValue.indexOf(props.value), 1)
            }
            emit('update:modelValue', newValue)
        } else {
            console.log('checkbox simple', isChecked)

            emit('update:modelValue', isChecked ? props.trueValue : props.falseValue)
        }
    }
}
</script>
  
 