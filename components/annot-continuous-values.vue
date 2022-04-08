<template>

    <b-table striped hover :items="items" id="annotation-table">
        
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
            
            items: {}
        },

        name: "continuous-table",
        
        data() {
        
            return {
        
                column: "cell(raw)"
            };
        }
    }

</script>
