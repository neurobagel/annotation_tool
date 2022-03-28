<template>
  <b-container fluid>

    <!--
        TODO: revisit the client-side render solution or remove but didn't have itthis comment
        The v-for statement below was causing a mismatch between client-side and server-side
        DOM. In particular, the first element in "pages" (Age) was rendered twice. The error message was:
          Vue warn]: The client-side rendered virtual DOM tree is not matching server-rendered content.
          This is likely caused by incorrect HTML markup,
          for example nesting bannotationlock-level elements inside <p>, or missing <tbody>.
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
              :columns="columnToCategoryMap"
              :dataTable="dataTable.original"
              :dataDictionary="dataDictionary.original"
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
        { title: "Age", component: "category-age", id: 0 },
        { title: "Sex", component: "category-sex", id: 1 },
        { title: "Diagnosis", component: "category-diagnosis", id: 2 },
        { title: "Assessment Tool", component: "category-assessment", id: 3 },
      ]
    };
  },
  computed: {
    ...mapState([
      "columnToCategoryMap",
      "dataTable",
      "dataDictionary",
      "pageData"
    ]),
  },
  methods: {
    writeColumn(event) {
      // TODO: find a more succinct implementation. The "delete" operator should work, but somehow doesn't
      console.log(
        `On the Annotation page, I was asked to remove "${event.removedColumn}" from the annotated columns`
      );

      // Unlink this column from its current category
      this.$store.dispatch("unlinkColumnWithCategory", { column: event.removedColumn });
    },
    writeTable(event) {
      console.log(
        "On the Annotation page, I got an updated datatable:",
        event.transformedTable
      );
      console.log(
        "I also got the corresponding transformations:",
        event.transformHeuristics
      );

      // Save the annotated table in the store
      this.$store.dispatch("saveAnnotatedDataTable", event.transformedTable);
    },
  },

    mounted() {

        // 1. Set the current page name
        this.$store.dispatch("setCurrentPage", "annotation");
    }

};
</script>

<style scoped></style>
