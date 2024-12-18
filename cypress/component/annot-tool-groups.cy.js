import annotToolGroups from "~/components/annot-tool-groups.vue";
import annotSingleTool from "~/components/annot-single-tool.vue";

const getters = {
    getSelectedTools: () => {
        return [
            {
                label: "MOCA",
                identifier: "snomed:MOCA",
                selected: true
            },
            {
                label: "UPDRS",
                identifier: "snomed:UPDRS",
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
        cy.get('[data-cy="tool-annotation-for-snomed:MOCA"]').contains('column1');
    });

    it("clicking the missing value button fires correct mutation", () => {
        const mockStore = { commit: () => {} };
        cy.spy(mockStore, "commit").as("commitSpy");

        cy.mount(annotToolGroups, {
            computed: getters,
            stubs: stubs,
            props: props,
            mocks: { $store: mockStore }
        });

        cy.get('[data-cy="tool-annotation-for-snomed:MOCA"]')
            .get('table')
            .find('tr')
            .eq(1)
            .then(row => {
                cy.wrap(row).contains("Mark as missing").click();
            });

            cy.get("@commitSpy").should("have.been.calledOnceWith", "changeMissingStatus", {
                column: "column1",
                value: 1,
                markAsMissing: true
            });
    });
});
