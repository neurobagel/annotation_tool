<template>
  <div>
    <b-card no-body>
      <b-card-header>I am a vocabulary header</b-card-header>
      <b-card-body>
        <b-table :items="displayTable" :fields="exampleFields" fixed>
          <template #cell(select_a_vocabulary_term)="row">
            <b-form-input
              id="input-live"
              :state="vocabState"
              aria-describedby="input-live-help input-live-feedback"
              :placeholder="placeholder"
              trim
              @input="doSomething($event, row.item)"
            ></b-form-input>
            <!--             This will only be shown if the preceding input has an invalid state -->
            <!--            <b-form-invalid-feedback id="input-live-feedback">-->
            <!--              Enter at least 3 letters-->
            <!--            </b-form-invalid-feedback>-->

            <!-- This is a form text block (formerly known as help block) -->
            <b-form-text id="input-live-help"
              >{{instruction}}
            </b-form-text>
          </template>
        </b-table>
      </b-card-body>
    </b-card>
    <b-button variant="success" @click="uploadMappings"
      >Confirm and Upload
    </b-button>
  </div>
</template>

<script>
// TODO: merge this component with the vocabulary component
export default {
  name: "AnnotVocabulary",
  data() {
    return {
      vocabularyMapping: {},
      vocabState: null,
    };
  },
  computed: {
    placeholder() {
      if (this.mode === "column") {
        return "e.g. MoCA"
      } else if (this.mode === "row") {
        return "e.g. Parkinson's Disease"
      } else {
        return ""
      }
    },
    instruction() {
      if (this.mode === "column") {
        return "Please provide a reproschema term"
      } else if (this.mode === "row") {
        return "Please provide a SNOMED-CT term"
      } else {
        return "Please provide an appropriate vocabulary term"
      }
    },
    relevantColumns() {
      //  Return only those columns that are annotated with the current category
      return Object.entries(this.columns)
        .filter(
          ([columnName, categoryName]) => categoryName === this.activeCategory
        )
        .map((element) => element[0]); // return only the column name that was assigned to this.activeCategory
    },
    exampleFields() {
      let defaultFields = [
        "column_name",
        "description",
        "select_a_vocabulary_term",
      ];
      if (this.mode === "column") {
        return defaultFields;
      }
      return [
        "column_name",
        "raw_value",
        "description",
        "select_a_vocabulary_term",
      ];
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
            return {
              column_name: colName,
              description:
                this.getDescription(colName)[0] === undefined
                  ? ""
                  : this.getDescription(colName)[0],
            };

            //  For row mode, we need the individual (unique) values of the relevant columns
          } else if (this.mode === "row") {
            return this.uniqueValues[colName].map((value) => {
              return {
                column_name: colName,
                raw_value: value,
                description:
                  this.getDescription(colName, value)[1] === undefined
                    ? ""
                    : this.getDescription(colName, value)[1],
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
      this.vocabularyMapping[row.column_name] = event;
    },
    uploadMappings() {
      this.$emit("update:heuristics", {
        heuristic: this.vocabularyMapping,
      }),
        console.log("uploaded diagnosis heuristics");
    },
    getDescription(columnName, value = null) {
      let columnDescription = undefined;
      let valueDescription = undefined;

      // If we do not have a data dictionary then the descriptions are undefined
      if (
        this.dataDictionary === null ||
        typeof this.dataDictionary !== "object" ||
        columnName === undefined
      ) {
        return [columnDescription, valueDescription];
      } else if (Object.keys(this.dataDictionary).includes(columnName)) {
        const columnDict = this.dataDictionary[columnName];
        columnDescription =
          columnDict[
            Object.keys(columnDict).find(
              (key) => key.toLowerCase() === "description"
            )
          ];

        if (value !== null) {
          const columnLevels =
            columnDict[
              Object.keys(columnDict).find(
                (key) => key.toLowerCase() === "levels"
              )
            ];
          if (columnLevels !== undefined) {
            valueDescription =
              columnLevels[
                Object.keys(columnLevels).find(
                  (key) => key.toLowerCase() === value.toLowerCase()
                )
              ];
          }
        }
      }
      return [columnDescription, valueDescription];
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
    dataDictionary: {
      type: Object,
      required: false,
      default: null,
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
