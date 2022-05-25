<template>

    <b-table
        hover
        striped
        id="annotation-table"
        :items="items">

        <!-- TODO: implement a way for the user to edit the transformed values -->
        <!--
            <template #[column]="row">
                 <b-button variant="info" >{{row.item.raw}} </b-button>
            </template>
        -->

    </b-table>

</template>

<script>

    export default {

        props: {

            items: { type: Array, default: () => [] }
        },

        name: "ContinuousTable",

        data() {

            return {

                column: "cell(raw)"
            };
        }
    };

</script>
