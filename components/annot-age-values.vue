<template>

    <div>
        <b-card no-body class="annotation-card">
            <b-card-header>Review the age harmonization</b-card-header>
            <b-card-body class="age-values-card-body">
                <annot-continuous-values :items="uniqueTableData"></annot-continuous-values>
            </b-card-body>
        </b-card>
        <b-button variant="success" @click="applyTransform">Save Annotation</b-button>
    </div>

</template>

<script>

    export default {

        props: {
            
            activeCategory: { type: String },
            columns: { type: Object },
            dataTable: { type: Object, required: true }
        },

        name: "sub-numeric-validation",
    
        data() {

            return {

                regularExpressions: [ // using named capture groups

                    '(?<float>\\d+\\.\\d+)',
                    '(?<bounded>\\d+\\+)',
                    '(?<euro>\\d+,\\d+)',
                    '(?<range>\\d+-\\d+)',
                    '(?<int>^\\d+$)',
                    '(?<string>^\\D+$)', // This needs to be before the ISO times to capture
                    '(?<isoyear>\\d+Y)?(?<isomonth>\\d+M)?',
                ],

                // TODO turn the range into an argument for the component
                unique_range: { start: 0, end: 3 },                
            }
        },

        computed: {
            
            ageRX() {

                // Creates a regular expression that combines all named capture groups with XOR relationships
                // The order matters here because the capture groups will match from first to last and stop on a match
                return new RegExp(this.regularExpressions.join("|"));
            },

            columnTransformHeuristics() {

                return Object.fromEntries(this.relevantColumns.map(colName => [colName, this.detectColumnAgeFormat(colName)]));
            },

            filteredTable() {

                // We want to use the origina dataTable here because we want to display the original raw values

                // We return a datatable where each row is filtered to only show the columns that are mapped to the active category
                return this.dataTable.original.map(row => {

                    return Object.fromEntries(
                        Object.entries(row)
                              .filter(([columnName, rowValue]) =>
                                this.relevantColumns.includes(columnName))
                    );
                });
            },                      

            relevantColumns() {
                //    Return only those columns that are annotated with the current category
                return Object.entries(this.columns)
                    .filter(([columnName, categoryName]) => categoryName === this.activeCategory)
                    .map(element => element[0]) // return only the column name that was assigned to this.activeCategory
            },

            uniqueValues() {
                // Extract array of unique values from filteredTable, keyed on the column names
                return Object.fromEntries(
                    this.relevantColumns.map(colName => {
                            const uniques = new Set(
                                this.filteredTable.map(row => row[colName])
                            )
                            return [colName, Array.from(uniques)]
                        }
                    )
                )
            },

            uniqueTableData() {
                return this.relevantColumns.map(colName => {
                        return this.uniqueValues[colName]
                            .slice(this.unique_range.start, this.unique_range.end)
                            .map(value => {
                                    return (
                                        {
                                            // This is where we define the format of the transformed value table
                                            column_name: colName,
                                            raw_value: value,
                                            heuristic: this.columnTransformHeuristics[colName],
                                            transformed_value: this.convertAge(value, this.columnTransformHeuristics[colName]),
                                        }
                                    )
                                }
                            )
                    }
                ).flat()
            }
        },

        methods: {

            applyTransform() {

                // TODO: we need to be able to handle bad values being passed here
                // Applies the currently stored transform heuristics to the input dataTable to make the results
                // available outside the component

                // We want to use the annotated dataTable here in order to not overwrite previous
                // annotations from other components
                const transformedTable = this.dataTable.annotated.map(row => {

                        return Object.fromEntries(
                            Object.entries(row).map(
                                ([colName, value]) => {

                                    if ( this.relevantColumns.includes(colName) ) {

                                        // TODO: if "value" is a missing value or doesn't fit the heuristic, this will currently break!
                                        return [colName, this.convertAge(value, this.columnTransformHeuristics[colName])]
                                    } else {

                                        return [colName, value]
                                    }
                                }
                            )
                        )
                    }
                );

                this.$emit("update:dataTable", {

                    transformHeuristics: this.columnTransformHeuristics,
                    transformedTable: transformedTable
                });
            },

            convertAge(value, transformHeuristic) {

                // TODO: maybe we can find an implementation that doesn't require us to repeat all the capture group names here
                // TODO: this method absolutely needs unit testing, particularly if we are going to expand it!

                let convertedValue = "";

                switch ( transformHeuristic ) {

                    case "float":
                        convertedValue = parseFloat(value);
                        break

                    case "bounded":
                        convertedValue = parseInt(value.replace("+", ""));
                        break;

                    case "euro":
                        convertedValue = parseFloat(value.replace(",", "."));
                        break;

                    case "range":
                        const [lower, upper] = value.split('-').map(val => parseFloat(val.trim()));
                        convertedValue = (lower + upper) / 2;
                        break;

                    case "int":
                        convertedValue = parseInt(value);
                        break;

                    case "string":
                        convertedValue = "missing value";
                        break;

                    case "isoyear":

                        // TODO: think of a way to get the values parsed without having to call the detectAge method again here
                        const ageFormats = this.detectAgeFormat(value);
                        const yearValue = parseInt(ageFormats.isoyear.replace("Y", ""));
                        const monthValue = Object.keys(ageFormats).includes("isomonth") ? parseInt(ageFormats.isomonth.replace("M", "")) / 12 : 0;
                        convertedValue = `${yearValue + monthValue}`;
                        break;

                    default:
                        break;
                }

                return convertedValue;
            },                      
            
            detectAgeFormat(value) {

                // Returns an Object array where keys are the format(s) of the age value and values are the portion of the
                // age value that matches this format (in some cases, only a substring may match, or there may be several substrings)
                // If no capture group matches, return "undefined"
                const regHits = this.ageRX.exec(value);

                if ( regHits !== null ) {

                    const matchingKeys = Object.keys(regHits.groups).filter(key => regHits.groups[key] !== undefined);
                    return Object.fromEntries(matchingKeys.map(key => [key, regHits.groups[key]]));
                }
            },

            detectColumnAgeFormat(columnName) {

                const columnFormats = {};
                for ( const value of this.uniqueValues[columnName] ) {

                    const format = Object.keys(this.detectAgeFormat(value))[0];

                    // NOTE: format will never be in columnFormats. It is a blank, local object.
                    if ( !(format in columnFormats) ) {
                        columnFormats[format] = 1;
                    } else {
                        columnFormats[format] += 1;
                    }
                }

                return this.getMostCommonFormat(columnFormats);
            },            

            getMostCommonFormat(formatCounts) {

                // We want to exclude "string" because it is the category for "missing" and we don't count these
                if ( Object.keys(formatCounts).includes("string") && 
                     Object.keys(formatCounts).length === 1 ) {

                    // All values in this column are "string". Not much we can do.
                    return "string";
                }

                const filteredCounts = Object.fromEntries(
                    Object.entries(formatCounts).filter(([key, value]) => key !== "string")
                );

                const countValues = Object.values(filteredCounts);
                const maxIndex = countValues.indexOf(Math.max(...countValues));

                return Object.keys(filteredCounts)[maxIndex];
            }
        }
    }

</script>

<style scoped>

.age-values-card-body {
    
    height: 300px;
    overflow-y: scroll;
    position: relative;
}

</style>
