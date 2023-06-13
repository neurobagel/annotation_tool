<template>

    <div :data-cy="activeCategory">

        <!-- Explanation text for this annotation tab -->
        <annot-explanation :data-cy="('annot-expl-' + activeCategory)" :active-category="activeCategory" />

        <!-- Lists all the columns linked to the category of this annotation tab -->
        <annot-columns :data-cy="('annot-col-' + activeCategory)" :active-category="activeCategory" />

        <!-- Lists any values determined to be missing (e.g. potentially invalid) in this tab's columns -->
        <annot-missing-values :data-cy="('annot-missing-' + activeCategory)" :active-category="activeCategory" />

        <!-- Component specializing in the particular kind of annotation for this tab's category -->
        <component
            :is="getAnnotationComponent(activeCategory)"
            :data-cy="(getAnnotationComponent(activeCategory) + '-' + activeCategory)"
            :active-category="activeCategory"
            :title="('annotate_' + activeCategory)" />

    </div>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    export default {

        props: {

            activeCategory: { type: String, required: true }
        },

        computed: {

            ...mapGetters([

                "getAnnotationComponent"
            ])
        }

    };

</script>
