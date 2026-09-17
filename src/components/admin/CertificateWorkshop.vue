<template><div class="text-sm text-gray-500">Loading…</div></template>
<script setup>
defineProps({ workshopId: String, workshopTitle: String, canvaConnected: Boolean, toast: Function })
defineEmits(['changed'])
</script>
