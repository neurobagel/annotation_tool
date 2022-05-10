<template>
  
    <div>

        <!-- Navigation bar -->
        <tool-navbar
            :nav-items="pageData"
            :nav-order="pageOrder"
            :page-name="pageData[currentPage].fullName" />
        
        <!-- Current page -->
        <Nuxt />
  
    </div>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    // Fields listed in mapState below can be found in the store (index.js)
    import { mapState } from "vuex";

    export default {

        name: "DefaultLayout",

        computed: {
                
            ...mapState([

                "currentPage",
                "pageData",
                "pageOrder"
            ])
        }
    }

</script>