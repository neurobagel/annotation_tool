<template>

    <div>


        <!-- Navbar -->
        <b-navbar toggleable="lg" type="light" variant="light">

            <!-- Brand -->
            <b-navbar-brand class="brand-styling" href="https://www.neurobagel.org/" target="_blank">
                <img
                    src="https://raw.githubusercontent.com/neurobagel/documentation/main/docs/imgs/logo/neurobagel_logo.png"
                    alt="Neurobagel Logo"
                    class="nav-logo" />
                <div class="nav-title-and-subtitle">
                    {{ uiText.toolName }} <b-badge v-b-tooltip.hover.right="'This tool is under active development. Please report any requests or issues on GitHub.'" class="badge">
                        beta
                    </b-badge>

                    <br />
                    <p class="nav-subtitle">
                        {{ uiText.subtitle }}
                    </p>
                </div>


            </b-navbar-brand>

            <!-- Collapse toggle -->
            <b-navbar-toggle target="nav-collapse" />

            <!-- All these children are collapsible -->
            <b-collapse id="nav-collapse" is-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto right-nav">

                    <b-nav-item
                        v-for="(pageName) in pageOrder"
                        :active="currentPageName === pageName"
                        :class="getNavItemColor(pageName)"
                        :data-cy="'menu-item-' + pageName"
                        :disabled="!isPageAccessible(pageName)"
                        :key="pageName"
                        @click="navigateToPage(pageName)">
                        {{ pageName }}
                    </b-nav-item>
                    <span class="nav-separator">|</span>
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
                        href="https://neurobagel.org/user_guide/annotation_tool/"
                        target="_blank">
                        {{ uiText.documentation }}
                    </b-nav-item>
                    <b-nav-item
                        class="dark"
                        data-cy="github"
                        href="https://github.com/neurobagel/annotation_tool/"
                        target="_blank">
                        <b-icon icon="github" font-scale="1" />
                    </b-nav-item>

                </b-navbar-nav>

            </b-collapse>

        </b-navbar>

    </div>

</template>

<script>

    import {mapActions, mapState, mapGetters} from "vuex";

    export default {

        data() {

            return {

                // Text for UI elements
                uiText: {

                    documentation: "Documentation",
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

                "pageOrder"
            ]),

            currentPageName() {
                return this.$route.name;
            }
        },

        methods: {
            ...mapActions([
                "navigateToPage"
            ]),

            getNavItemColor(pageName) {

                // Default color for currently unaccessible page
                let variant = "secondary";

                // The nav item color for the current page
                if ( this.currentPageName === pageName ) {
                    variant = "dark";
                }
                // Else, if the page is accessible
                else if ( this.isPageAccessible(pageName) ) {
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

    .nav-separator {

        font-size: 1.5em;
    }

    .nav-subtitle {
        color: grey;
        font-size: 16px;
        font-weight: 700;
        text-decoration: none;
    }

    .nav-title-and-subtitle {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    margin-top: 10px;
    }

    .right-nav {

        padding-right: 1em;
    }

    .nav-logo {

        height: 60px;
        width: auto;
    }
    .badge {
        font-size: 13px;
        vertical-align: middle;
    }

</style>
