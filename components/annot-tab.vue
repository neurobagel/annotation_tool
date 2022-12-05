<template>

    <div>

        <!-- Explanation text for this annotation tab -->
        <annot-explanation :data-cy="'annot-expl-' + title" />

        <!-- Lists all the columns linked to the category of this annotation tab -->
        <annot-columns
            :active-category="`age`" />

        <!-- Lists any values determined to be missing (e.g. potentially invalid) in this tab's columns -->
        <annot-missing-values />

        <!-- Component specializing in the particular kind of annotation for this tab's category -->
        <component
            :is="annot-explanation"
            :data-cy="'annot-component-' + title"
            :id-field="idField"
            :title="title" />

    </div>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    export default {

        data() {

            return {

                details: "",
                title: "hello",

                // Category of the current annotation tab
                category: "",

                // String name of the column assigned the 'Subject ID' category in the data table
                idField: "",

                // Disabled state of the save annotation button
                saveButtonDisabled: true
            };
        },

        computed: {
        }

    };

</script>
