<template>
  <div>
    <b-card no-body class="annotation-card">
      <b-card-header>Annotate each unique value</b-card-header>
      <b-card-body>
        <b-table striped :items="displayTable" :fields="exampleFields" fixed>
          <template #cell(select_a_vocabulary_term)="row">
            <b-form-input
              id="input-live"
              :state="vocabState"
              aria-describedby="input-live-help input-live-feedback"
              :placeholder="placeholder"
              trim
              @input="updateVocabularyMapping($event, row.item)"
            ></b-form-input>
            <!--             This will only be shown if the preceding input has an invalid state -->
            <!--            <b-form-invalid-feedback id="input-live-feedback">-->
            <!--              Enter at least 3 letters-->
            <!--            </b-form-invalid-feedback>-->

            <!-- This is a form text block (formerly known as help block) -->
            <b-form-text id="input-live-help">{{ instruction }}</b-form-text>
          </template>
        </b-table>
        <b-button
          @click="uploadVocabularyMappings"
          :disabled="buttonDisabled"
          :variant="saveAnnotationButtonColor">
          Confirm and Upload
        </b-button>
      </b-card-body>
    </b-card>
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
      buttonDisabled: true,
    };
  },
  mounted() {
    // Initialize the mapping of all unique values as null
    this.initializeVocabularyMapping();
  },
  computed: {
    placeholder() {
      if (this.mode === "column") {
        return "e.g. MoCA";
      } else if (this.mode === "row") {
        return "e.g. Parkinson's Disease";
      } else {
        return "";
      }
    },
    instruction() {
      if (this.mode === "column") {
        return "Please provide a reproschema term";
      } else if (this.mode === "row") {
        return "Please provide a SNOMED-CT term";
      } else {
        return "Please provide an appropriate vocabulary term";
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

    saveAnnotationButtonColor() {

        // Bootstrap variant color of the button to save the annotation to the data table
        return ( !this.buttonDisabled ) ? "success" : "secondary"
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
      // We want to use the origina dataTable here because we want to display the original raw values

      // We return a datatable where each row is filtered to only show the columns that are mapped to the active category
      return this.dataTable.original.map((row) => {
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
    initializeVocabularyMapping() {
      // TODO: revisit this once we have implemented the missing value components to make sure
      // we don't break things by later turning values into missing values
      // Initialize the mapping as empty
      this.vocabularyMapping = {};
      if (this.mode === "row") {
        for (const [colName, uniqueValues] of Object.entries(
          this.uniqueValues
        )) {
          // Now we will create a mapping of the form { uniqueVale: null } for each unique value
          this.vocabularyMapping[colName] = Object.fromEntries(
            uniqueValues.map((uniqueValue) => [uniqueValue, null])
          );
        }
      } else if (this.mode === "column") {
        // TODO: revisit why we do not have access to this.uniqueValues in column Mode.
        for (const colName of this.relevantColumns) {
          this.vocabularyMapping[colName] = null;
        }
      }
    },
    updateVocabularyMapping(event, row) {
      if (this.mode === "row") {
        this.vocabularyMapping[row.column_name][row.raw_value] = event;
        this.checkVocabularyAnnotationState();

      } else if (this.mode === "column") {
        this.vocabularyMapping[row.column_name] = event;
        this.checkVocabularyAnnotationState();
      }
    },
    checkVocabularyAnnotationState() {
      const colHasUnmappedValues = Object.values(this.vocabularyMapping).map(
        (uniqueColValues) => {
          if (this.mode === "row") {
            // uniqueColValues is an object keyed on each unique value of this column with the
            // value being the assigned mapping, initialized to "null"
            return Object.values(uniqueColValues).some(
              (uniqueValue) => uniqueValue === null
            );
          } else if (this.mode === "column") {
            // uniqueColValues is just a string mapped to the column
            // if it is not null we are good
            return uniqueColValues === null;
          }
        }
      );
      this.buttonDisabled = colHasUnmappedValues.some(
        (value) => value === true
      );
    },
    uploadVocabularyMappings() {
      if (this.mode === "column") {
        this.$emit("update:heuristics", {
          transformHeuristics: this.vocabularyMapping,
        });
      } else if (this.mode === "row") {
        // We want to use the annotated dataTable here in order to not overwrite previous
        // annotations from other components
        const transformedTable = this.dataTable.annotated.map((row) => {
          return Object.fromEntries(
            Object.entries(row).map(([colName, value]) => {
              if (this.relevantColumns.includes(colName)) {
                return [colName, this.vocabularyMapping[colName][value]];
              } else {
                return [colName, value];
              }
            })
          );
        });
        this.$emit("update:dataTable", {
          transformedTable: transformedTable,
          transformHeuristics: this.valueMapping,
        });
      }
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
      type: Object,
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
