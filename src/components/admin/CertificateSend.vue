<template><div /></template>
<script setup>
defineProps({ workshopId: String, workshopTitle: String, templateReady: Boolean, ready: Boolean, recipients: Array, sampleName: String, toast: Function })
defineEmits(['changed'])
</script>
