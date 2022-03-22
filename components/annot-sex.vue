<template>
  <div>
    <annot-explanation :explanation="explanation"></annot-explanation>
  </div>
</template>

<script>
export default {
  name: 'AnnotSex',
  data() {
    return {
      explanation: 'This is an explanation for how to annotate sex',
    };
  },
};
</script>

<style scoped></style>
