<template>

    <div>

        <!-- Explanation text for this annotation tab -->
        <annot-explanation :explanation="details.explanation"></annot-explanation>

        <!-- Lists all the columns linked to the category of this annotation tab -->
        <annot-columns
            :active-category="details.category"
            :relevantColumns="relevantColumns"
            @remove:column="$emit('remove:column', $event)"></annot-columns>

        <!-- Component specializing in the particular kind of annotation for this tab's category -->
        <component 
            :is="details.specializedComponent"
            :filteredDataTable="filteredDataTable"
            :options="details.options"
            :relevantColumns="relevantColumns"
            :uniqueValues="uniqueValues"
            @update:dataTable="$emit('update:dataTable', $event)"
            @update:heuristics="$emit('update:heuristics', $event)"></component>     

    </div>

</template>

<script>

    export default {

        props: {

            details: { type: Object, required: true }
        },

        inject: [

            "columnToCategoryMap",
            "dataTable"
        ],

        data() {

            return {

                // Disabled state of the save annotation button
                saveButtonDisabled: true,

                // Category of the current annotation tab
                category: ""
            }
        },

        computed: {

            filteredDataTable() {

                console.log("annotation-tab:filteredDataTable" + " for " + this.details.category);

                let filteredTable = this.dataTable.original.map((row) => {

                    return Object.fromEntries(
                        Object.entries(row).filter(([columnName, rowValue]) =>
                            this.relevantColumns.includes(columnName))
                    );
                });

                console.log(`result: ${JSON.stringify(filteredTable)}`);

                // Return a data table where each row is filtered to only show the columns that are mapped to the given category
                // NOTE: The original data table is used here because we want to display the original raw values
                return filteredTable;
            },

            relevantColumns() {

                console.log("annotation-tab:relevantColumns" + " for " + this.details.category);
                console.log(`columnToCategoryMap: ${JSON.stringify(this.columnToCategoryMap)}`);

                // Create and return a list of columns that are categorized with this tab's category
                let columnList = [];
                for ( const columnName in this.columnToCategoryMap ) {

                    if ( this.category === this.columnToCategoryMap[columnName] ) {
                        columnList.push(columnName);
                    }
                }

                console.log(`result: ${columnList}`);

                return columnList;

                // // Return only those columns that are annotated with the current category
                // return Object.entries(this.columnToCategoryMap)
                //              .filter(([columnName, categoryName]) => categoryName === this.category)
                //              .map((element) => element[0]);
            },           

            uniqueValues() {

                console.log("annotation-tab:uniqueValues" + " for " + this.details.category);

                // 1. Create and return an object that maps column names to unique values from the filtered table
                let uniqueValuesMap = {};
                for ( const columnName of this.relevantColumns ) {

                    // A. Get unique values for this column from the filtered table
                    uniqueValuesMap[columnName] = Array.from(new Set(this.filteredDataTable.map(row => row[columnName])));
                }

                // console.log(`annotation-tab uniqueValues() produces ${JSON.stringify(uniqueValuesMap)}`);
                // console.log(`relevantColumns were ${this.relevantColumns}`);
                // console.log(`filteredDataTable was ${JSON.stringify(this.filteredDataTable)}`);

                console.log(`result: ${JSON.stringify(uniqueValuesMap)}`);

                return uniqueValuesMap;

                // return Object.fromEntries(
                //     this.relevantColumns.map(columnName => {

                //         // Get unique values for this column from the filtered table
                //         const uniqueValues = new Set(this.filteredTable.map(row => row[columnName]));

                //         return [columnName, Array.from(uniqueValues)]
                //     })
                // );
            }                   
        },

        created() {

            // NOTE: The category must be set here in created or the components
            // for 'annot-tab' will not be initialized correctly

            // Set the given category for this tab
            this.category = this.details.category;
        }
    }

</script>