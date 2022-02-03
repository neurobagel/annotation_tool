<template>

    <div>

        <!-- Navbar -->
        <b-navbar toggleable="lg" type="light" variant="light">

            <!-- Brand -->
            <b-navbar-brand class="brand-styling">Origami Annotation Tool</b-navbar-brand>

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
                <b-navbar-nav class="ml-auto nav-pills" id="right-nav">

                    <!-- For 2/1/2022 TODO - define color classes that indicate pages not yet are enabled -->
                    <b-nav-item 
                        to="/" 
                        :active="'index' == this.$route.name"
                        :class="('index' == this.$route.name) ? 'currentPageNavPill' : ''"
                        :disabled="!navItemsState['index']">File Selection</b-nav-item>
                    <b-nav-item 
                        to="column-categorization"
                        :active="'column-categorization' == this.$route.name"
                        :class="('column-categorization' == this.$route.name) ? 'currentPageNavPill' : ''"
                        :disabled="!navItemsState['column-categorization']">Categorization</b-nav-item>
                    <!-- <b-nav-item 
                        to="annotation" 
                        :active="'annotation' == this.$route.name"
                        :class="('annotation' == this.$route.name) ? 'currentPageNav' : ''"
                        :disabled="!navItemsState['annotation']">Categorization</b-nav-item>
                    <b-nav-item 
                        to="download" 
                        :active="'download' == this.$route.name"
                        :class="('download' == this.$route.name) ? 'currentPageNav' : ''"
                        :disabled="!navItemsState['download']">Categorization</b-nav-item> -->

                    <!-- <b-nav-item to="" :active="$route.name == 'index'">File Selection</b-nav-item>
                    <b-nav-item to="column-categorization" :active="$route.name == 'column-categorization'">Categorization</b-nav-item>
                    <b-nav-item to="annotation" :active="$route.name == 'annotation'">Annotation</b-nav-item> -->

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

        props: ["navItemsState"]

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

#right-nav {
    padding-right: 2em;
}

</style>
