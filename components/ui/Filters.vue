<template>
    <UiCard>
        <label for="">Filters</label>
        <div :class="styles.box">
            <slot></slot>
        </div>

    </UiCard>
</template>

<script setup>
const styles = {
    box: "flex  flex-wrap rounded-md bg-white   p-3 mx-2"
}
</script>