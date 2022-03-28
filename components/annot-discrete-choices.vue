<template>
  <div>
    <b-card no-body>
      <b-card-header>I am a header</b-card-header>
      <b-card-body>
        <b-table :items="displayTable" :fields="exampleFields">
          <template #cell(select_an_appropriate_mapping)="row">
            <!--Bootstrap-Vue doesn't have a great option here so I am using https://vue-select.org/-->
            <!--Note: we use the $event statement to add the row data to the payload of the @input
                event without replacing the original event payload -->
            <v-select
              label="Standard"
              :options="annotationOptions"
              @input="updateMapping($event, row.item)"
            ></v-select>
          </template>
        </b-table>
        <b-button
          variant="success"
          @click="applyTransform"
          :disabled="buttonDisabled"
          >Confirm and Upload
        </b-button>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "AnnotDiscreteValues",
  data() {
    return {
      exampleFields: [
        "column_name",
        "raw_value",
        "select_an_appropriate_mapping",
      ],
      valueMapping: {},
      buttonDisabled: true,
    };
  },
  mounted() {
    // Initialize the mapping of all unique values as null
    this.initializeValueMapping();
  },
  computed: {
    relevantColumns() {
      //  Return only those columns that are annotated with the current category
      return Object.entries(this.columns)
        .filter(
          ([_columnName, categoryName]) => categoryName === this.activeCategory
        )
        .map((element) => element[0]); // return only the column name that was assigned to this.activeCategory
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
          return this.uniqueValues[colName].map((value) => {
            return {
              column_name: colName,
              raw_value: value,
            };
          });
        })
        .flat();
    },
  },
  methods: {
    initializeValueMapping() {
      // TODO: revisit this once we have implemented the missing value components to make sure
      // we don't break things by later turning values into missing values
      // Initialize the mapping as empty
      this.valueMapping = {};
      for (const [colName, uniqueValues] of Object.entries(this.uniqueValues)) {
        // Now we will create a mapping of the form { uniqueVale: null } for each unique value
        this.valueMapping[colName] = Object.fromEntries(
          uniqueValues.map((uniqueValue) => [uniqueValue, null])
        );
      }
    },
    removeRow(row) {
      // TODO: use this method to move unique values to the missing value category
      console.log(row);
    },
    updateMapping(selectedValue, row) {
      this.valueMapping[row.column_name][row.raw_value] = selectedValue;
      // Determine whether all unique values have now been mapped to something
      // TODO: this might be better suited for a computed property, but this seems to
      //  break reactivity
      this.checkAnnotationState();
    },
    checkAnnotationState() {
      const colHasUnmappedValues = Object.values(this.valueMapping).map(
        (uniqueColValues) => {
          // uniqueColValues is an object keyed on each unique value of this column with the
          // value being the assigned mapping, initialized to "null"
          // example: uniqueColValues = { "m": null, "f": female }
          return Object.values(uniqueColValues).some(
            (uniqueValue) => uniqueValue === null
          );
        }
      );
      this.buttonDisabled = colHasUnmappedValues.some(
        (value) => value === true
      );
    },
    applyTransform() {
      // We want to use the annotated dataTable here in order to not overwrite previous
      // annotations from other components
      const transformedTable = this.dataTable.annotated.map((row) => {
        return Object.fromEntries(
          Object.entries(row).map(([colName, value]) => {
            if (this.relevantColumns.includes(colName)) {
              return [colName, this.valueMapping[colName][value]];
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
    },
  },
  watch: {
    relevantColumns: function (newColumns, oldColumns) {
      const removedColumns = oldColumns.filter(column => ! newColumns.includes(column));
      // const addedColumns = newColumns.filter(column => ! oldColumns.includes(column));

      if (removedColumns.length > 0) {
        // There has been at least one column removed from the activeCategory,
        // possibly via the annot-columns component remove action
        for (let columnName of removedColumns) {
          // We cannot just remove the key from the object with a normal
          // JS delete operator because then Vue wouldn't be aware of it.
          // See also: https://v2.vuejs.org/v2/api/?redirect=true#vm-delete
          this.$delete(this.valueMapping, columnName);
        }
      //  TODO: check if we need to also handle the case where a column is added
      }
      this.checkAnnotationState();
    }
  },
  props: {
    dataTable: {
      type: Object,
      required: true,
    },
    activeCategory: {
      type: String,
    },
    columns: {
      type: Object,
    },
    annotationOptions: {
      type: Array,
      // default values for Arrays or Objects have to be created with constructor functions
      // see: https://vuejs.org/guide/components/props.html#prop-validation
      default() {
        // TODO: we currently let users tell us about a missing value in the same way they annotate real values
        // we should instead have a separate mechanism to identify missing values
        return ["default category", "missing value"];
      },
    }
  },
};
</script>

<style scoped></style>
