<template>
  <div>
    <annot-explanation :explanation="explanation"></annot-explanation>

    <annot-columns
      :columns="columns"
      :active-category="activeCategoryName"
      @remove:column="$emit('remove:column', $event)"
    ></annot-columns>

    <annot-discrete-choices
      :active-category="activeCategoryName"
      :columns="columns"
      :data-table="dataTable"
      :annotation-options="annotationOptions"
      @update:dataTable="$emit('update:dataTable', $event)"
    >
    </annot-discrete-choices>
  </div>
</template>

<script>
export default {
  name: "annotate_gender",
  data() {
    return {
      explanation: "This is an explanation for how to annotate sex",
      activeCategoryName: "Sex",
      annotationOptions: ["male", "female", "other", "missing value"],
    };
  },
  props: {
    columns: {
      type: Object,
      required: true,
    },
    dataTable: {
      type: Object,
      required: true
    }
  },
};
</script>

<style scoped></style>
