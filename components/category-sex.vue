<template>

    <div>

        <annot-explanation :explanation="explanation"></annot-explanation>

        <annot-columns
            :active-category="activeCategoryName"
            :columns="columns"
            @remove:column="$emit('remove:column', $event)"></annot-columns>

        <annot-discrete-choices
            :active-category="activeCategoryName"
            :annotation-options="annotationOptions"
            :columns="columns"
            :data-table="dataTable"
            @update:dataTable="$emit('update:dataTable', $event)"></annot-discrete-choices>
            
    </div>

</template>

<script>

    export default {

        props: {

            columns: { type: Object, required: true, },
            dataTable: { type: Object, required: true }
        },

        name: "annotate_gender",

        data() {

            return {

                activeCategoryName: "Sex",
                annotationOptions: ["male", "female", "other", "missing value"],
                explanation: "This is an explanation for how to annotate sex"
            };
        }
    }

</script>
