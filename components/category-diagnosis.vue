<template>
  <div>
    <annot-explanation :explanation="explanation"></annot-explanation>

    <annot-columns
      :columns="columns"
      :active-category="activeCategoryName"
      @remove:column="$emit('remove:column', $event)"
    ></annot-columns>

    <annot-vocabulary
      :active-category="activeCategoryName"
      :columns="columns"
      :data-table="dataTable"
      @update:heuristics="$emit('update:heuristics', $event)"
    ></annot-vocabulary>
  </div>
</template>

<script>
export default {
  name: "AnnotDiagnosis",
  data() {
    return {
      explanation: "This is an explanation for how to annotate diagnosis",
      activeCategoryName: "Diagnosis"
    };
  },
  props: {
    columns: {
      type: Object,
      required: true
    },
    dataTable: {
      type: Array,
    },
  }
};
</script>

<style scoped></style>
