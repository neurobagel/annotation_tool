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
            :data-dictionary="dataDictionary"
            mode="column"
            @update:heuristics="$emit('update:heuristics', $event)"></annot-vocabulary>

    </div>

</template>

<script>

    export default {

        props: {

            columns: { type: Object, required: true },
            dataDictionary: { type: Object, required: false, default: null }
        },        

        name: "AnnotAssessment",

        data() {

            return {

                activeCategoryName: "Assessment Tool",
                explanation: "This is an explanation for how to annotate assessments"
            };
        }
    }

</script>
