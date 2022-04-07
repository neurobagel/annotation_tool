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

                <!-- TODO: Hardcode the pages and just toggle visibility based on state-->
                <b-tab
                    v-for="page in pages"
                    :key="page.id"
                    :title="page.title"
                    :title-link-class="tabStyle(page.title)">

                    <b-card-text>
                        <component
                            :columns="columnToCategoryMap"
                            :dataDictionary="dataDictionary.original"
                            :dataTable="dataTable"
                            :is="page.component"
                            @remove:column="writeColumn($event)"
                            @update:dataTable="writeTable($event)"></component>
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
                    {{ buttonText }}
                </b-button>
            </b-col>

        </b-row>

    </b-container>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    // Fields listed in mapState below can be found in the store (index.js)
    import { mapState } from "vuex";

    export default {
    
        name: "AnnotationPage",

        data() {

            return {

                // Next button text
                buttonText: "Next step: Review and download harmonized data",

                // TODO: "pages" is used as static testing data. Should be replaced with actual list of used categories
                // from global state / store
                pages: [

                    { title: "Age", component: "category-age", id: 0 },
                    { title: "Sex", component: "category-sex", id: 1 },
                    { title: "Diagnosis", component: "category-diagnosis", id: 2 },
                    { title: "Assessment Tool", component: "category-assessment", id: 3 },
                ],

                tabNavTitle: "",
            };
        },

        computed: {

            ...mapState([

                "categories",
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

        mounted() {

            // 1. Set the current page name
            this.$store.dispatch("setCurrentPage", "annotation");

            // 2. Set the initial tab title for styling purposes
            this.tabNavTitle = this.categories[0];

			// 3. If any data has been annotated, enable the download page and perform setup actions
			this.$store.dispatch("enablePage", {

				pageName: "download",
				enable: this.$store.getters.isDataAnnotated
			});
        },

        methods: {

            tabStyle(p_category) {

                // Return the style for the tab given the category it represents
                return ["annotation-tab-nav", this.categoryClasses[p_category]];
            },

            writeColumn(p_event) {

                // TODO: find a more succinct implementation. The "delete" operator should work, but somehow doesn't

                // Unlink this column from its current category
                this.$store.dispatch("unlinkColumnWithCategory", { column: p_event.removedColumn });
            },

            writeTable(event) {

                // 1. Save the annotated table in the store
                this.$store.dispatch("saveAnnotatedDataTable", event.transformedTable);

                // 2. If any data has been annotated, enable the download page and perform setup actions
                this.$store.dispatch("enablePage", {

                    pageName: "download",
                    enable: this.$store.getters.isDataAnnotated
                });
            },
        }
    };

</script>
