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
  name: "Annotation",
  data() {
    return {
      // TODO: "pages" is used as static testing data. Should be replaced with actual list of used categories
      // from global state / store
      pages: [
        {title: 'Age', component: 'annot-age', id: 0},
        {title: 'Sex', component: 'annot-gender', id: 1},
        {title: 'Diagnosis', component: 'annot-diagnosis', id: 2},
        {title: 'Assessment', component: 'annot-assessment', id: 3}
      ],
    }
  },
  computed: {

    ...mapState([
      "pageData",
      "pageOrder"
    ])
  },
}
</script>

<style scoped>

</style>
