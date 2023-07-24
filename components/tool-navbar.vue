<template>

    <div>

        <!-- Navbar -->
        <b-navbar toggleable="lg" type="light" variant="light">

            <!-- Brand -->
            <b-navbar-brand class="brand-styling" href="https://www.neurobagel.org/" target="_blank">
                <b-row style="padding: 0; margin: 0;">
                    {{ uiText.toolName }}
                </b-row>
                <b-row id="nav-subtitle" style="padding: 0; margin: 0;">
                    {{ uiText.subtitle }}
                </b-row>
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
                        :disabled="!isPageAccessible(navItem.pageName)"
                        :key="navItem.pageName"
                        :to="navItem.location"
                        @click="setCurrentPage(navItem.pageName)">
                        {{ navItem.fullName }}
                    </b-nav-item>
                    <span id="nav-separator">|</span>
                    <b-nav-item
                        class="dark"
                        data-cy="version"
                        href="https://github.com/neurobagel/annotation_tool/releases/tag/0.2.0"
                        target="_blank">
                        {{ uiText.version }}
                        <!-- style="border-left: 2px solid #212529;" -->
                    </b-nav-item>
                    <b-nav-item
                        class="dark"
                        data-cy="docs"
                        href="https://www.neurobagel.org/annotation_tool/"
                        target="_blank">
                        {{ uiText.documentation }}
                    </b-nav-item>
                    <b-nav-item
                        class="dark"
                        data-cy="feedback"
                        href="https://github.com/neurobagel/annotation_tool/issues/"
                        target="_blank">
                        {{ uiText.feedback }}
                    </b-nav-item>
                    <b-nav-item
                        class="dark"
                        data-cy="github"
                        href="https://github.com/neurobagel/annotation_tool/"
                        target="_blank">
                        <b-icon icon="github" font-scale="1"/>
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

                    documentation: "Documentation",
                    feedback: "Feedback",
                    subtitle: "Harmonize phenotypic data",
                    toolName: "Neurobagel Annotate",
                    version: "v0.2.0"
                }
            };
        },

        computed: {

            ...mapGetters([

                "isPageAccessible"
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
                else if ( this.isPageAccessible(p_navItemData.pageName) ) {
                    variant = "success";
                }

                return variant;
            }
        }
    };

</script>

<style>

    .brand-styling {

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
        font-size: 2em;
        font-weight: 700;
        padding-left: 1em;
    }

    .navbar {

        background-color: white !important;
        padding-top: 1em;
        padding-bottom: 1em;
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

    #nav-separator {

        font-size: 1.5em;
    }

    #nav-subtitle {

        color: #470a68;
        font-size: 16px;
        font-weight: normal;
        text-decoration: none;
    }

    #right-nav {

        padding-right: 2em;
    }

</style>
