<template>
  <div>
    <annot-explanation :explanation="explanation"></annot-explanation>

    <annot-columns
      :columns="columns"
      :active-category="activeCategoryName"
      @remove:column="$emit('remove:column', $event)"
    ></annot-columns>
  </div>
</template>

<script>
export default {
  name: "AnnotAssessment",
  data() {
    return {
      explanation: "This is an explanation for how to annotate assessments",
      activeCategoryName: "Assessment"
    };
  },
  props: {
    columns: {
      type: Object,
      required: true
    },
  }
};
</script>

<style scoped></style>
