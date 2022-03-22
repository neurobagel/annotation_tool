<template>
  <b-container fluid>
    <!-- Navigation bar -->
    <tool-navbar
      :navItems="pageData"
      :navOrder="pageOrder"
      :pageName="pageData.annotation.fullName"
    >
    </tool-navbar>
<!--
    TODO: revisit the client-side render solution or remove this comment
    The v-for statement below was causing a mismatch between client-side and server-side
    DOM. In particular, the first element in "pages" (Age) was rendered twice. The error message was:
      Vue warn]: The client-side rendered virtual DOM tree is not matching server-rendered content.
      This is likely caused by incorrect HTML markup,
      for example nesting block-level elements inside <p>, or missing <tbody>.
      Bailing hydration and performing full client-side render.

    The best answer I found online was this pretty useless stackoverflow answer:
    https://stackoverflow.com/a/61375490/1302009 suggesting that this might be due to some
    async getting of Array data.
    I forced this block to be rendered client-side only for now and that fixed it for now
    See: https://nuxtjs.org/docs/features/nuxt-components/#the-client-only-component
-->
    <no-ssr>
      <!-- This gives us built-in keyboard navigation! -->
      <b-tabs pills card vertical>
  <!--      TODO: hardcode the pages and just toggle visibility based on state-->
        <b-tab v-for="page in pages" :title="page.title" :key="page.id">
          <b-card-text>
            <component
              :is="page.component"
              :columns="annotated_columns"
              :dataTable="data_table"
              @remove:column="writeColumn($event)"
              @update:dataTable="writeTable($event)"
            ></component>
          </b-card-text>
        </b-tab>
      </b-tabs>
    </no-ssr>
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
      data_table: [
        { age: 11, group: 'PD', sex: 'male', iq: 80, number_comorbid_dx: 1, otherAge: '10Y8M', not_age: "hello" },
        { age: 12, group: 'CTL', sex: 'n/a', iq: 99, number_comorbid_dx: 1, otherAge: '11Y', not_age: "hello" },
        { age: 11, group: 'Double', sex: 'female', iq: 100, number_comorbid_dx: 2, otherAge: '12Y5M', not_age: "hello" },
        { age: 13, group: 'PD', sex: 'male', iq: 110, number_comorbid_dx: 11, otherAge: '12Y', not_age: "hello" },
        { age: 103, group: 'CTL', sex: 'n/a', iq: 101, number_comorbid_dx: 0, otherAge: '9Y2M', not_age: "hello" },
      ],
    };
  },
  computed: {
    ...mapState(["pageData", "pageOrder"]),
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
    writeTable(event) {
      console.log('On the Annotation page, I got an updated datatable:', event.transformedTable)
      console.log('I also got the corresponding transformations:', event.transformHeuristics)
    },
  }
};

</script>

<style scoped></style>
