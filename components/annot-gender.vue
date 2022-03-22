<template>
  <div>
    <annot-explanation :explanation="explanation"></annot-explanation>
  </div>
</template>

<script>
export default {
  name: 'AnnotGender',
  data() {
    return {
      explanation: 'This is an explanation for how to annotate gender',
    };
  },
};
</script>

<style scoped></style>
