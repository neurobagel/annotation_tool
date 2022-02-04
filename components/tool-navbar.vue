<template>

    <div>

        <!-- Navbar -->
        <b-navbar toggleable="lg" type="light" variant="light">

            <!-- Brand -->
            <b-navbar-brand class="brand-styling">
                Origami Annotation Tool - <span class="page-name">{{ pageName }}</span>
            </b-navbar-brand>

            <!-- Collapse toggle -->
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <!-- All these children are collapsible -->
            <b-collapse id="nav-collapse" is-nav>

                <!-- Nav items -->
                <!-- <b-navbar-nav>
                    <b-progress class="mt-2" :max="max" show-value show-progress animated>
                        <b-progress-bar :value="value * (6 / 10)" variant="success"></b-progress-bar>
                        <b-progress-bar :value="value * (2.5 / 10)" variant="warning"></b-progress-bar>
                        <b-progress-bar :value="value * (1.5 / 10)" variant="danger"></b-progress-bar>
                    </b-progress>
                </b-navbar-nav> -->

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto" id="right-nav">

                    <b-nav-item v-for="navItem in navItemsState" :key="navItem.pageInfo.pageName"
                        :to="navItem.pageInfo.location"
                        :disabled="!navItem.enabled">{{ navItem.pageInfo.fullName }}</b-nav-item>

                    <!-- Search bar -->
                    <!-- <b-nav-form>
                        <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                        <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                    </b-nav-form> -->

                    <!-- Dropdown -->
                    <!-- <b-nav-item-dropdown text="Lang" right>
                        <b-dropdown-item href="#">EN</b-dropdown-item>
                        <b-dropdown-item href="#">ES</b-dropdown-item>
                        <b-dropdown-item href="#">RU</b-dropdown-item>
                        <b-dropdown-item href="#">FA</b-dropdown-item>
                    </b-nav-item-dropdown> -->

                    <!-- Dropdown -->
                    <!-- <b-nav-item-dropdown right> -->

                        <!-- Using 'button-content' slot -->
                        <!-- <template #button-content>
                            <em>User</em>
                        </template>

                        <b-dropdown-item href="#">Profile</b-dropdown-item>
                        <b-dropdown-item href="#">Sign Out</b-dropdown-item>

                    </b-nav-item-dropdown> -->

                </b-navbar-nav>

            </b-collapse>

        </b-navbar>

    </div>
</template>

<script>

    import { BProgress, BProgressBar } from "bootstrap-vue";

    export default {

		components: {

			"b-progress": BProgress,
			"b-progress-bar": BProgressBar
		},

        data() {

            return {
                max: 100,
                value: 45
            }
        },

        methods: {

            checkStorePageAccessibility(p_pageName) {

                let stateFields = Object.keys(this.$store.getters.pageAccessibility);
                let storeHasPageName = ( stateFields.includes(p_pageName) );

                if ( storeHasPageName ) {
                    return this.$store.getters.pageAccessibility[p_pageName](this.$route.name);
                }
                return false;
            }
        },

        props: ["navItemsState", "pageName"]

    }
</script>

<style>

.brand-styling {

    font-size: 2.25em;
    font-family: -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        "Helvetica Neue",
        Arial,
        "Noto Sans",
        "Liberation Sans",
        sans-serif,
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji";
    padding-left: 1em;
}


.currentPageNavPill a {

    color: white !important;
    background-color: #28a745 !important;
}

.navbar {
    background-color: white !important;
}

.page-name {
    
    color: #28a745;
}

#right-nav {
    padding-right: 2em;
}

</style>
