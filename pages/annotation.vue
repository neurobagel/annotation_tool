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
                    v-for="(category, index) in getMappedCategories(categorySkipList)"
                    :key="index"
                    :title="category"
                    :title-link-class="['annotation-tab-nav', colorInfo.categoryClasses[category]]">

                    <b-card-text>
                        <annot-tab :active-category="category" />
                    </b-card-text>

                </b-tab>

            </b-tabs>
        </client-only>

    </b-container>

</template>

<script>

    // Allows for reference to store actions, getters, mutations, and state fields (index.js)
    import { mapGetters, mapState } from "vuex";

    export default {

        name: "AnnotationPage",

        data() {

            return {

                categorySkipList: ["Subject ID"],
                tabNavTitle: 0
            };
        },

        mounted() {

            console.log(`mappedCategories in annotation.vue mount(): ${JSON.stringify(this.columnToCategoryMap)}`);
        },

        computed: {

            ...mapGetters([

                "getMappedCategories"
            ]),

            ...mapState([

                "colorInfo",
                "columnToCategoryMap"
            ])
        }
    };

</script>
