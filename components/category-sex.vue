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
  name: "annotate_gender",
  data() {
    return {
      explanation: "This is an explanation for how to annotate sex",
      activeCategoryName: "Sex",
    };
  },
  props: {
    columns: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped></style>
