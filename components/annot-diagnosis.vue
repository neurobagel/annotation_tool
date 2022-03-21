<template>
<div>
  <annot-explanation :explanation="explanation"></annot-explanation>
</div>
</template>

<script>
export default {
  name: "annotate_diagnosis",
  data() {
    return {
      explanation: 'This is an explanation for how to annotate diagnosis',
    }
  },
}
</script>

<style scoped>

</style>
