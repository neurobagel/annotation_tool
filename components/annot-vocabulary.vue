<template>
  <div>
    <b-card no-body>
      <b-card-header>I am a vocabulary header</b-card-header>
      <b-card-body>
        <b-table :items="displayTable" :fields="exampleFields">
          <template #cell(select_a_vocabulary_term)="row">
            <b-form-input
              id="input-live"
              v-model="things[row.item.column_name]"
              :state="vocabState"
              aria-describedby="input-live-help input-live-feedback"
              placeholder="enter the SNOMED-CT URI here"
              trim
              @input="doSomething($event, row.item)"
            ></b-form-input>

            <!--             This will only be shown if the preceding input has an invalid state -->
            <!--            <b-form-invalid-feedback id="input-live-feedback">-->
            <!--              Enter at least 3 letters-->
            <!--            </b-form-invalid-feedback>-->

            <!-- This is a form text block (formerly known as help block) -->
            <b-form-text id="input-live-help"
              >Please provide a SNOMED-CT term.</b-form-text
            >
          </template>
        </b-table>
      </b-card-body>
    </b-card>
    <b-button variant="success" @click="uploadMappings"
      >Confirm and Upload</b-button
    >
  </div>
</template>

<script>
// TODO: merge this component with the vocabulary component
export default {
  name: "AnnotVocabulary",
  data() {
    return {
      things: {},
      vocabState: null,
    };
  },
  computed: {
    relevantColumns() {
      //  Return only those columns that are annotated with the current category
      return Object.entries(this.columns)
        .filter(
          ([columnName, categoryName]) => categoryName === this.activeCategory
        )
        .map((element) => element[0]); // return only the column name that was assigned to this.activeCategory
    },
    exampleFields() {
      let defaultFields =  ["column_name", "select_a_vocabulary_term"];
      if (this.mode === "column") {
        return defaultFields;
      }
      return  ["column_name", "raw_value", "select_a_vocabulary_term"];
    },
    filteredTable() {
      // We return a datatable where each row is filtered to only show the columns that are mapped to the active category
      return this.dataTable.map((row) => {
        return Object.fromEntries(
          Object.entries(row).filter(([columnName, _rowValue]) =>
            this.relevantColumns.includes(columnName)
          )
        );
      });
    },
    uniqueValues() {
      // Extract array of unique values from filteredTable, keyed on the column names
      return Object.fromEntries(
        this.relevantColumns.map((colName) => {
          const uniques = new Set(
            this.filteredTable.map((row) => row[colName])
          );
          return [colName, Array.from(uniques)];
        })
      );
    },
    displayTable() {
      return this.relevantColumns
        .map((colName) => {

          // If we are in column mode, we don't need to render individual values
          if (this.mode === "column") {
            return { column_name: colName };

          //  For row mode, we need the individual (unique) values of the relevant columns
          } else if (this.mode === "row") {
            return this.uniqueValues[colName].map((value) => {
              return {
                column_name: colName,
                raw_value: value,
              };
            });
          }
        })
        .flat();
    },
  },
  methods: {
    doSomething(event, row) {
      console.log("I am doing something with:", event, "in", row.column_name);
      this.things[row.column_name] = event;
    },
    determineState(valueName) {},
    uploadMappings() {
      this.$emit("update:heuristics", {
        heuristic: this.things,
      }),
        console.log("uploaded diagnosis heuristics");
    },
  },
  props: {
    columns: {
      type: Object,
      required: true,
    },
    dataTable: {
      type: Array,
      required: false,
    },
    activeCategory: {
      type: String,
    },
    mode: {
      // one of [ "column", "row" ]
      // column: only the column names are mapped to vocabulary terms inside the data dictionary
      // row: the row values are mapped to vocabulary terms
      type: String,
      default: "row",
    },
  },
};
</script>

<style scoped></style>
