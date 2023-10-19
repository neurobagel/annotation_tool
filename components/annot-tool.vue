<template>

    <div>

        <b-card
            no-body
            class="annotation-card">
            <b-tabs content-class="mt-3" fill>
                <b-tab
                    v-for="({label, identifier}, index) in getSelectedTools"
                    :key="index"
                    :title="label">
                    {{ identifier }}
                </b-tab>

            </b-tabs>

        </b-card>

    </div>

</template>

<script>
    import { mapGetters } from "vuex";

    export default {
        computed: {
            ...mapGetters([
                "getSelectedTools"
            ])
        }
    };

</script>