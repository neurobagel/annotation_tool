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
        <no-ssr>

            <!-- This gives us built-in keyboard navigation! -->
            <b-tabs
                card
                pills
                vertical
                v-model="tabNavTitle">

                <b-tab
                    v-for="details in annotationDetails"
                    :key="details.id"
                    :title="details.category"
                    :title-link-class="tabStyle(details.category)">

                    <b-card-text>
                        <annot-tab
                            :details="details"
                            @remove:column="unlinkColumnFromCategory($event)"
                            @update:dataTable="saveAnnotatedDataTable($event)"></annot-tab>
                    </b-card-text>

                </b-tab>


            </b-tabs>
        </no-ssr>

        <b-row>

            <b-col cols="7"></b-col>

            <!-- Button to proceed to the next page -->
            <!-- Only enabled when at least one annotation table write has been done -->
            <b-col cols="5">
                <b-button
                    class="float-right"
                    :disabled="!pageData.download.accessible"
                    :to="'/' + pageData.download.location"
                    :variant="nextPageButtonColor">
                    {{ uiText.nextButton }}
                </b-button>
            </b-col>

        </b-row>

    </b-container>

</template>

<script>

    // Fields listed in mapState below can be found in the store (index.js)
    import { mapState } from "vuex";

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    export default {
    
        name: "AnnotationPage",

        data() {

            return {

                tabNavTitle: 0,

                // Text for UI elements
                uiText: {

                    nextButton: "Next step: Review and download harmonized data"
                }
            };
        },

        computed: {

            ...mapGetters([

                "columnDescription",
                "valueDescription",
                "isDataAnnotated"
            ]),

            ...mapState([

                "annotationDetails",
                "categoryClasses",
                "columnToCategoryMap",
                "dataTable",
                "dataDictionary",
                "pageData"
            ]),

            nextPageButtonColor() {

                // Bootstrap variant color of the button leading to the download page
                return this.pageData.download.accessible ? "success" : "secondary";
            }
        },

        provide() {

            return {

                columnToCategoryMap: this.columnToCategoryMap,
                dataTable: this.dataTable,
                dataDictionary: this.dataDictionary,
                columnDescription: this.columnDescription,
                valueDescription: this.valueDescription
            };
        },

        mounted() {

            // 1. Set the current page name
            this.$store.dispatch("setCurrentPage", "annotation");

            // 2. If any data has been annotated, enable the download page and perform setup actions
            this.$store.dispatch("initializePage", {

                pageName: "download",
                enable: this.isDataAnnotated
            });
        },

        methods: {

            saveAnnotatedDataTable(p_event) {

                // 1. Save the annotated table in the store
                this.$store.dispatch("saveAnnotatedDataTable", p_event.transformedTable);

                // 2. Enable or disable the download page when the annotated data table has been written,
                // depending on whether or not an annotation has occurred
                this.$store.dispatch("initializePage", {

                    pageName: "download",
                    enable: this.isDataAnnotated
                });
            },            

            tabStyle(p_category) {

                // The 'title-link-class' attribute for b-tab expects a single or list of classes
                return ["annotation-tab-nav", this.categoryClasses[p_category]];
            },

            unlinkColumnFromCategory(p_event) {

                // 1. Undo annotation for this column
                this.$store.dispatch("revertColumnToOriginal", p_event.removedColumn);

                // 2. Unlink this column from its currently-assigned category
                this.$store.dispatch("unlinkColumnFromCategory", { column: p_event.removedColumn });
            }
        }
    };

</script>
