<template>

  <b-container fluid>

    <!-- Navigation bar -->
    <tool-navbar
      :navItems="pageData"
      :navOrder="pageOrder"
      :pageName="pageData.annotation.fullName">
    </tool-navbar>

    <!-- This gives us built-in keyboard navigation! -->
    <b-tabs pills card vertical>
<!--      TODO: hardcode the pages and just toggle visibility based on state-->
      <b-tab v-for="page in pages" :title="page.title" :key="page.id">
        <b-card-text>
          <component
            :is="page.component"
            :columns="annotated_columns"
            @remove:column="writeColumn($event)"
          ></component>
        </b-card-text>
      </b-tab>
    </b-tabs>
  </b-container>

</template>

<script>
// Allows for reference to store data by creating simple, implicit getters
// Fields listed in mapState below can be found in the store (index.js)
import { mapState } from "vuex";

export default {

  data() {

    return {
      // TODO: "pages" is used as static testing data. Should be replaced with actual list of used categories
      // from global state / store
      pages: [
        {title: 'Age', component: 'category-age', id: 0},
        {title: 'Sex', component: 'category-gender', id: 1},
        {title: 'Diagnosis', component: 'category-diagnosis', id: 2},
        {title: 'Assessment', component: 'category-assessment', id: 3}
      ],
      // TODO: replace this with global state getter for annotated columns
      annotated_columns: {
        "age": "Age",
        "sex": "Gender",
        "not_age": "Age",
        "group": "Diagnosis",
        "number_comorbid_dx": "Diagnosis",
        "medload": "Assessment",
        "iq": "Assessment",
        "otherAge": "Age"
      },
    }
  },
  computed: {

    ...mapState([
      "pageData",
      "pageOrder"
    ])
  },
  methods: {
    writeColumn(event) {
      // TODO: find a more succinct implementation. The "delete" operator should work, but somehow doesn't
      console.log(`On the Annotation page, I was asked to remove "${event.removedColumn}" from the annotated columns`)
      const temp = {}
      for (let key in this.annotated_columns) {
        if (key !== event.removedColumn) {
          temp[key] = this.annotated_columns[key]
        }
      }
      this.annotated_columns = temp
    },
  }
}

</script>

<style scoped>

</style>
