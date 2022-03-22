<template>
  <div>
    <annot-explanation :explanation="explanation"></annot-explanation>
  </div>
</template>

<script>
export default {
  name: "AnnotAssessment",
  data() {
    return {
      explanation: "This is an explanation for how to annotate assessments",
    };
  },
};
</script>

<style scoped></style>
