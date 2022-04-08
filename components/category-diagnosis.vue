<template>

    <div>

        <annot-explanation :explanation="explanation"></annot-explanation>

        <annot-columns
            :active-category="activeCategoryName"
            :columns="columns"
            @remove:column="$emit('remove:column', $event)"></annot-columns>

        <annot-vocabulary
            :active-category="activeCategoryName"
            :columns="columns"
            :data-table="dataTable"
            :data-dictionary="dataDictionary"
            @update:dataTable="$emit('update:dataTable', $event)"
            @update:heuristics="$emit('update:heuristics', $event)"></annot-vocabulary>
            
    </div>

</template>

<script>

    export default {

        props: {
            
            columns: { type: Object, required: true },
            dataDictionary: { type: Object, required: false, default: null },
            dataTable: { type: Object, required: true }
        },        

        name: "AnnotDiagnosis",

        data() {

            return {

                activeCategoryName: "Diagnosis",
                explanation: "This is an explanation for how to annotate diagnosis",
            };
        }
    }

</script>
