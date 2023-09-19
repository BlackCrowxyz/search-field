<template>
    <button :class="styles.tab">
        <slot></slot>
        <IconsClose width="20px" class="pl-1" />
    </button>
</template>

<script setup>
const styles = {
    tab: "flex justify-end items-center focus:outline-none text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-3 py-1.5 mr-2 mb-2 dark:focus:ring-yellow-900"
}
</script>