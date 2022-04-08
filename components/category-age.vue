<template>

    <div>

        <annot-explanation :explanation="explanation"></annot-explanation>

        <annot-columns
            :active-category="activeCategoryName"
            :columns="columns"
            @remove:column="$emit('remove:column', $event)"></annot-columns>

        <annot-age-values
            :active-category="activeCategoryName"
            :columns="columns"
            :data-table="dataTable"
            @update:dataTable="$emit('update:dataTable', $event)"></annot-age-values>

    </div>

</template>

<script>

    export default {

        props: {
            
            columns: { type: Object, required: true },
            dataTable: { type: Object, required: true }
        },        

        name: "annotate_age",

        data() {

            return {

                activeCategoryName: "Age",
                explanation: "This is an explanation for how to annotate age"
            };
        }
    }

</script>
