<template>
  <div>
    <annot-explanation :explanation="explanation"></annot-explanation>

    <annot-columns
      :columns="columns"
      :active-category="activeCategoryName"
      @remove:column="$emit('remove:column', $event)"
    ></annot-columns>

    <annot-age-values
      :active-category="activeCategoryName"
      :columns="columns"
      :data-table="dataTable"
      :pageData="pageData"
      @update:dataTable="$emit('update:dataTable', $event)"
    ></annot-age-values>
  </div>
</template>

<script>
export default {
  name: "annotate_age",
  data() {
    return {
      explanation: 'This is an explanation for how to annotate age',
      activeCategoryName: 'Age'
    }
  },
  props: {
    columns: {
      type: Object,
      required: true
    },
    dataTable: {
      type: Array
    },
    pageData: {
      type: Object,
      required: true
    }    
  }
}
</script>

<style scoped>

</style>
