<template>

    <div>

        <!-- Navbar -->
        <b-navbar toggleable="lg" type="light" variant="light">

            <!-- Brand -->
            <b-navbar-brand class="brand-styling">
                <h1>{{ uiText.toolName }}</h1>
            </b-navbar-brand>

            <!-- Collapse toggle -->
            <b-navbar-toggle target="nav-collapse" />

            <!-- All these children are collapsible -->
            <b-collapse id="nav-collapse" is-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto" id="right-nav">

                    <b-nav-item
                        v-for="(navItem, _key) in pageData"
                        :active="currentPageName === navItem.fullName"
                        :class="getNavItemColor(navItem)"
                        :data-cy="'menu-item-' + navItem.pageName"
                        :disabled="!pageAccessible(navItem.pageName)"
                        :key="navItem.pageName"
                        :to="navItem.location"
                        @click="setCurrentPage(navItem.pageName)">
                        {{ navItem.fullName }}
                    </b-nav-item>

                </b-navbar-nav>

            </b-collapse>

        </b-navbar>

    </div>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    // Allows for direct mutations of store data
    import { mapMutations } from "vuex";

    // Fields listed in mapState below can be found in the store (index.js)
    import { mapState } from "vuex";

    export default {

        data() {

            return {

                // Text for UI elements
                uiText: {

                    toolName: "Annotation Tool"
                }
            };
        },

        computed: {

            ...mapGetters([

                "pageAccessible"
            ]),

            ...mapState([

                "currentPage",
                "pageData"
            ]),

            currentPageName() {

                return this.pageData[this.currentPage].fullName;
            }
        },

        methods: {

            ...mapMutations([

                "setCurrentPage"
            ]),

            getNavItemColor(p_navItemData) {

                // Default color for currently unaccessible page
                let variant = "secondary";

                // The nav item color for the current page
                if ( this.currentPageName === p_navItemData.fullName ) {
                    variant = "dark";
                }
                // Else, if the page is accessible
                else if ( p_navItemData.accessible  ) {
                    variant = "success";
                }

                return variant;
            }
        }
    };

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

    .navbar {

        background-color: white !important;
    }

    .nav-item.dark a {

        color: #000 !important;
    }

    .nav-item.secondary a {

        color: #adb5bd !important;
    }

    .nav-item.success a {

        color: #28a745 !important;
    }

    #right-nav {

        padding-right: 2em;
    }

</style>
