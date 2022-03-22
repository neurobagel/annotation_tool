<template>
  <div>
    <annot-explanation :explanation="explanation"></annot-explanation>
  </div>
</template>

<script>
export default {
  name: 'AnnotAge',
  data() {
    return {
      explanation: 'This is an explanation for how to annotate age',
    };
  },
};
</script>

<style scoped></style>
