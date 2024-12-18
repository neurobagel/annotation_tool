import { mutations } from "~/store";

let store;

describe("createToolGroup mutation", () => {

    beforeEach(() => {

        store = {

            state: {

                toolTerms: [
                    {
                        label: "MOCA",
                        identifier: "snomed:MOCA",
                        selected: false
                    },
                    {
                        label: "UPDRS",
                        identifier: "snomed:UPDRS",
                        selected: false
                    }
                ]
            }
        };
    });

    it("Makes sure mutation sets a value in the toolTerms state object", () => {

        // Act
        mutations.createAssessmentTool(store.state, { identifier: 'snomed:MOCA', label: 'MOCA' });
        // Assert
        expect(store.state.toolTerms.filter(tool => tool.identifier === 'snomed:MOCA')[0]['selected']).to.be.true;
    });

});
