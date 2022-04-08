<template>

    <div>

        <!-- Navbar -->
        <b-navbar toggleable="lg" type="light" variant="light">

            <!-- Brand -->
            <b-navbar-brand class="brand-styling">
                <h1>{{ uiText.toolName }}</h1>
            </b-navbar-brand>

            <!-- Collapse toggle -->
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <!-- All these children are collapsible -->
            <b-collapse id="nav-collapse" is-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto" id="right-nav">

                    <b-nav-item
                        v-for="(navItem, key) in navItems"
                        :active="pageName == navItem.fullName"
                        :disabled="!navItem.accessible"
                        :key="navItem.pageName"
                        :to="navItem.location"
                        :class="determineNavItemColor(navItem)">
                        {{ navItem.fullName }}
                    </b-nav-item>

                </b-navbar-nav>

            </b-collapse>

        </b-navbar>

    </div>

</template>

<script>

    export default {

		props: {

            navItems: { type: Object, required: true },
            pageName: { type: String, required: true }
        },

        data() {

            return {
                
                // Text for UI elements
                uiText: {

                    toolName: "Annotation Tool"
                }
            }
        },

        methods: {

            determineNavItemColor(p_navItemData) {

                let variant = "secondary";

                // The nav item for this page
                if ( this.pageName === p_navItemData.fullName ) {
                    variant = "dark";
                }
                // Else, if the page is accessible
                else if ( p_navItemData.accessible  ) {
                    variant = "success";
                }

                return variant;
            }
        }
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
