import annotToolGroups from "~/components/annot-tool-groups.vue";
import annotSingleTool from "~/components/annot-single-tool.vue";

const getters = {
    getSelectedTools: () => {
        return [
            {
                label: "MOCA",
                identifier: "cogAtlas:MOCA",
                selected: true
            },
            {
                label: "UPDRS",
                identifier: "cogAtlas:UPDRS",
                selected: true
            }
        ];
    },
    getColumnsForTool: () => (p_tool) => {
        return ["column1", "column2"];
    },
    getUniqueColumnValues: () => (column) => {
        return [1, 2, 3];
    }
};

const stubs = {

    "annot-single-tool": annotSingleTool
};


const props = [
    {
        column: "column1",
        value: "val1"
    },
    {
        column: "column2",
        value: "val1"
    },
    {
        column: "column2",
        value: "val2"
    }
];


describe("Annotation tool component", () => {

    it("mounts", () => {
        cy.mount(annotToolGroups, {
            computed: getters,
            stubs: stubs,
            props: props
        });

    });

    it("Takes a list of tools and makes a tab for each tool", () => {
        cy.mount(annotToolGroups, {
            computed: getters,
            stubs: stubs,
            props: props
        });
        cy.contains('MOCA');
        cy.contains('UPDRS');
    });

    it("mounts a subcomponent for each tool and provides the correct props to it", () => {
        cy.mount(annotToolGroups, {
            computed: getters,
            stubs: stubs,
            props: props
        });
        cy.contains('MOCA');
        cy.contains('UPDRS');
    });
});
