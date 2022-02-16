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
