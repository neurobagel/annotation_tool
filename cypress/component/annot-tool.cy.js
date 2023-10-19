import annotTool from "~/components/annot-tool.vue";




describe("Annotation tool component", () => {

    it("mounts", () => {
        cy.mount(annotTool, {
            computed: {
                getSelectedTools: () => {
                    return [
                        {
                            label: "MOCA",
                            identifier: "cogAtlas:MOCA",
                            selected: false
                        }
                    ];
                }
            }
        });

    });

    it("Takes a list of tools and makes a tab for each tool", () => {
        cy.mount(annotTool, {
            computed: {
                getSelectedTools: () => {
                    return [
                        {
                            label: "MOCA",
                            identifier: "cogAtlas:MOCA",
                            selected: false
                        }
                    ];
                }
            }
        });
        cy.contains('MOCA');
    });
});
