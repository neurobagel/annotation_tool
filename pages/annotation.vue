<template>

    <b-container fluid>

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
        <client-only>
            <!-- This gives us built-in keyboard navigation! -->
            <b-tabs
                card
                pills
                vertical
                data-cy="annotation-category-tabs"
                nav-wrapper-class="col-2"
                v-model="tabNavTitle">

                <b-tab
                    v-for="details in annotationDetails"
                    :key="details.id"
                    :title="tabTitle(details)"
                    :title-link-class="tabStyle(details)">

                    <b-card-text>
                        <annot-tab
                            :details="details"
                            :title="tabTitle(details)"
                            @remove:column="unlinkColumnFromCategory($event)"
                            @remove:missingValue="removeMissingValue($event)"
                            @update:dataTable="setAnnotatedDataTable($event.transformedTable)"
                            @update:missingColumnValues="setMissingColumnValues($event)"
                            @update:missingValue="addMissingValue($event)" />
                    </b-card-text>

                </b-tab>

            </b-tabs>
        </client-only>

    </b-container>

</template>

<script>

    // Allows for reference to store actions (index.js)
    import { mapActions } from "vuex";

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    // Allows for direct mutations of store data
    import { mapMutations } from "vuex";

    // Fields listed in mapState below can be found in the store (index.js)
    import { mapState } from "vuex";

    export default {

        name: "AnnotationPage",

        data() {

            return {

                tabNavTitle: 0
            };
        },

        computed: {

            ...mapGetters([

                "getGroupOfTool",
                "isToolGrouped"
            ]),

            ...mapState([

                "annotationDetails",
                "categoryClasses",
                "missingColumnValues",
                "toolGroups"
            ])
        },

        methods: {

            ...mapActions([

                "revertColumnToOriginal"
            ]),

            ...mapMutations([

                "deleteToolFromGroup",
                "removeColumnCategorization",
                "setAnnotatedDataTable",
                "setMissingColumnValues"
            ]),

            addMissingValue(p_event) {

                // This method expects an event object with a `column` and a `value` key.
                // It will merge the new missing value with the existing missing value array for
                // the `column` name and save it to the global store

                let columnMissingValues = {};

                if ( Object.keys(this.missingColumnValues).includes(p_event.column) ) {

                    // If missing values are already listed for this column, we add the new value to them
                    // We will reconstruct the array of missing values from the store because we don't want to copy it directly
                    // TODO: an alternative approach would be to use deepcopy from https://github.com/lodash/lodash
                    columnMissingValues[p_event.column] = [];
                    for ( const value of this.missingColumnValues[p_event.column] ) {

                        columnMissingValues[p_event.column].push(value);
                    }

                    // We do a sanity check to see if the new missing value is already listed as missing
                    // This should not happen unless a missing value is erroneously still being shown in the list of values to be annotated.
                    if ( !columnMissingValues[p_event.column].includes(p_event.value) ) {

                        columnMissingValues[p_event.column].push(p_event.value);
                    } else {

                        console.log(p_event.value, "is already in the list of missing values for column", p_event.column);
                    }

                } else {

                    // Because no missing values were listed in the store for this column before, we just save the new one
                    columnMissingValues[p_event.column] = [p_event.value];
                }

                this.setMissingColumnValues(columnMissingValues);
            },

            removeMissingValue(p_event) {

                // 1. Create copy of the missing values list for this column without the value to be removed
                const missingValuesList = {};
                missingValuesList[p_event.column] = [];

                for ( const value of this.missingColumnValues[p_event.column] ) {

                    // A. Do not save the given value to the new missing values list
                    if ( value !== p_event.value ) {
                        missingValuesList[p_event.column].push(value);
                    }
                }

                // 2. Save the new missing value list for this column to the store
                this.setMissingColumnValues(missingValuesList);
            },

            tabStyle(p_details) {

                // NOTE: The 'title-link-class' attribute for b-tab expects a single or list of classes

                // Style assessment tool group tabs like assessment tools
                if ( Object.hasOwn(p_details, "groupName") ) {

                    return ["annotation-tab-nav", this.categoryClasses["Assessment Tool"]];
                }

                // Else, style the tab based on the detail's category
                return ["annotation-tab-nav", this.categoryClasses[p_details.category]];
            },

            tabTitle(p_details) {

                // Return the annotation detail's tool group name if it exists,
                // otherwise just the detail's category
                return ( Object.hasOwn(p_details, "groupName") ) ?
                    p_details.groupName : p_details.category;

            },

            unlinkColumnFromCategory(p_event) {

                // 1. Undo annotation for this column
                this.revertColumnToOriginal(p_event.removedColumn);

                // 2. Unlink this column from its currently-assigned category
                this.removeColumnCategorization(p_event.removedColumn);

                // 3. If this column was a grouped tool, remove it from its group
                if ( this.isToolGrouped(p_event.removedColumn) ) {

                    // A. Remove the tool from its group
                    const groupName = this.getGroupOfTool(p_event.removedColumn);
                    this.deleteToolFromGroup({

                        group: groupName,
                        tool: p_event.removedColumn
                    });

                    // B. If its former group is now empty of tools, remove the group itself
                    for ( const groupName in this.toolGroups ) {
                        if ( 0 === this.toolGroups[groupName].length ) {

                            this.deleteToolFromGroup({ name: groupName });
                        }
                    }
                }
            }
        }
    };

</script>
