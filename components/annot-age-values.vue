<template>

    <div>

        <b-card
            no-body
            class="annotation-card">
            <b-card-header>{{ uiText.instructions }}</b-card-header>
            <b-card-body class="age-values-card-body">
                <annot-continuous-values :items="uniqueTableData" />
            </b-card-body>
        </b-card>

        <!-- Button to save the annotated data of this tab to the store -->
        <b-row>
            <b-button
                :disabled="saveButtonDisabled"
                :variant="saveButtonColor"
                @click="applyAnnotation">
                {{ uiText.saveButton }}
            </b-button>
        </b-row>

    </div>

</template>

<script>

    export default {

        props: {

            filteredDataTable: { type: Array, default: () => [] },
            options: { type: Object, default: () => {} },
            relevantColumns: { type: Array, required: true },
            uniqueValues: { type: Object, required: true }
        },

        inject: [

            "dataTable",
            "missingValueLabel"
        ],

        name: "SubNumericValidation",

        data() {

            return {

                saveButtonDisabled: false,

                regularExpressions: [ // using named capture groups

                    '(?<float>\\d+\\.\\d+)',
                    '(?<bounded>\\d+\\+)',
                    '(?<euro>\\d+,\\d+)',
                    '(?<range>\\d+-\\d+)',
                    '(?<int>^\\d+$)',
                    '(?<string>^\\D+$)', // This needs to be before the ISO times to capture
                    '(?<isoyear>\\d+Y)?(?<isomonth>\\d+M)?'
                ],

                // Text for UI elements
                uiText: {

                    instructions: "Review the age harmonization",
                    saveButton: "Save Annotation"
                },

                // TODO: Turn the range into an argument for the component
                unique_range: { start: 0, end: 3 }
            };
        },

        computed: {

            ageRegex() {

                // Creates a regular expression that combines all named capture groups with XOR relationships
                // The order matters here because the capture groups will match from first to last and stop on a match
                return new RegExp(this.regularExpressions.join("|"));
            },

            columnTransformHeuristics() {

                // Create and return a map between column name and detected age format
                const heuristicsDict = {};
                for ( const columnName of this.relevantColumns ) {
                    heuristicsDict[columnName] = this.detectColumnAgeFormat(columnName);
                }

                return heuristicsDict;
            },

            saveButtonColor() {

                // Bootstrap variant color of the button to save the annotation to the data table
                return ( !this.saveButtonDisabled ) ? "success" : "secondary";
            },

            uniqueTableData() {

                // Create and return a table listing metadata about these age values
                const tableData = [];
                for ( const columnName of this.relevantColumns ) {
                    for ( let index = this.unique_range.start; index < this.unique_range.end; index++ ) {

                        const currentHeuristic = this.columnTransformHeuristics[columnName];
                        const currentValue = this.uniqueValues[columnName][index];

                        tableData.push({

                            column_name: columnName,
                            heuristic: currentHeuristic,
                            raw_value: currentValue,
                            transformed_value: this.convertAge(currentValue, currentHeuristic)
                        });
                    }
                }

                return tableData;
            }
        },

        methods: {

            applyAnnotation() {

                // TODO: We need to be able to handle bad values being passed here
                // Applies the currently stored transform heuristics to the input dataTable to make the results
                // available outside the component

                // We want to use the annotated dataTable here in order to not overwrite previous
                // annotations from other components

                // 1. Create a local copy of the annotated table for transformation
                const transformedTable = structuredClone(this.dataTable.annotated);

                // 2. Transform all values in columns categorized as 'age' columns
                for ( let index = 0; index < transformedTable.length; index++ ) {
                    for ( const columnName in transformedTable[index] ) {

                        if ( this.relevantColumns.includes(columnName) ) {

                            // TODO: if "value" is a missing value or doesn't fit the heuristic, this will currently break!
                            transformedTable[index][columnName] = this.transformedValue(columnName, transformedTable[index][columnName]);
                        }
                    }
                }

                // 3. Trigger a save of this transformation to the annotated table in the store
                this.$emit("update:dataTable", {

                    transformHeuristics: this.columnTransformHeuristics,
                    transformedTable: transformedTable
                });
            },

            convertAge(p_value, p_transformHeuristic) {

                // TODO: maybe we can find an implementation that doesn't require us to repeat all the capture group names here
                // TODO: this method absolutely needs unit testing, particularly if we are going to expand it!

                let convertedValue = "";

                switch ( p_transformHeuristic ) {

                    case "float":
                        convertedValue = parseFloat(p_value);
                        break;

                    case "bounded":
                        convertedValue = parseInt(p_value.replace("+", ""));
                        break;

                    case "euro":
                        convertedValue = parseFloat(p_value.replace(",", "."));
                        break;

                    case "range": {
                        const [lower, upper] = p_value.split('-').map(val => parseFloat(val.trim()));
                        convertedValue = (lower + upper) / 2;
                        break;
                    }

                    case "int":
                        convertedValue = parseInt(p_value);
                        break;

                    case "string":
                        convertedValue = this.missingValueLabel;
                        break;

                    case "isoyear": {

                        // TODO: think of a way to get the values parsed without having to call the detectAge method again here
                        const ageFormats = this.detectAgeFormat(p_value);
                        const yearValue = parseInt(ageFormats.isoyear.replace("Y", ""));
                        const monthValue = Object.keys(ageFormats).includes("isomonth") ? parseInt(ageFormats.isomonth.replace("M", "")) / 12 : 0;
                        convertedValue = `${yearValue + monthValue}`;
                        break;
                    }

                    default:
                        break;
                }

                return convertedValue;
            },

            detectAgeFormat(p_value) {

                // Returns an Object array where keys are the format(s) of the age value and values are the portion of the
                // age value that matches this format (in some cases, only a substring may match, or there may be several substrings)
                // If no capture group matches, return "undefined"
                const regexHits = this.ageRegex.exec(p_value);

                if ( regexHits !== null ) {

                    const matchingKeys = Object.keys(regexHits.groups).filter(key => undefined !== regexHits.groups[key]);
                    return Object.fromEntries(matchingKeys.map(key => [key, regexHits.groups[key]]));
                }
            },

            detectColumnAgeFormat(p_columnName) {

                const columnFormats = {};
                for ( const value of this.uniqueValues[p_columnName] ) {

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

            getMostCommonFormat(p_formatCounts) {

                // We want to exclude "string" because it is the category for "missing" and we don't count these
                if ( Object.keys(p_formatCounts).includes("string") &&
                    1 === Object.keys(p_formatCounts).length ) {

                    // All values in this column are "string". Not much we can do.
                    return "string";
                }

                const filteredCounts = Object.fromEntries(
                    Object.entries(p_formatCounts).filter(([key, value]) => "string" !== key)
                );

                const countValues = Object.values(filteredCounts);
                const maxIndex = countValues.indexOf(Math.max(...countValues));

                return Object.keys(filteredCounts)[maxIndex];
            },

            transformedValue(p_columnName, p_value) {

                return this.convertAge(p_value, this.columnTransformHeuristics[p_columnName]);
            }
        }
    };

</script>

<style scoped>

    .age-values-card-body {

        height: 300px;
        overflow-y: scroll;
        position: relative;
    }

</style>
