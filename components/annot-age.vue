<template>
  <div>
    <annot-explanation :explanation="explanation"></annot-explanation>
  </div>
</template>

<script>
export default {
  name: "annotate_age",
  data() {
    return {
      explanation: 'This is an explanation for how to annotate age',
    }
  },
}
</script>

<style scoped>

</style>
