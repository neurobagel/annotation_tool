<template>
    <b-table
        data-cy="assessment-column-table"
        outlined
        selectable
        head-variant="dark"
        :items="tableRows"
        select-mode="single"
        selected-variant=""
        thead-class="hidden" />
</template>

<script>

    import { mapGetters } from 'vuex';

    export default {

        computed: {
            ...mapGetters([
                'getColumnsForCategory'
            ]),
            tableRows() {
                return this.getColumnsForCategory('Assessment Tool').map(column => ({
                    column: column
                }));
            }
        }
    };
</script>