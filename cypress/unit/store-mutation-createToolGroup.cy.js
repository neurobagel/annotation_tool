import { mutations } from "~/store";

let store;

describe("createToolGroup mutation", () => {

    beforeEach(() => {

        store = {

            state: {

                toolTerms: [
                    {
                        label: "MOCA",
                        identifier: "cogAtlas:MOCA",
                        selected: false
                    },
                    {
                        label: "UPDRS",
                        identifier: "cogAtlas:UPDRS",
                        selected: false
                    }
                ]
            }
        };
    });

    it("Makes sure mutation sets a value in the toolTerms state object", () => {

        // Act
        mutations.createAssessmentTool(store.state, { identifier: 'cogAtlas:MOCA', label: 'MOCA' });
        // Assert
        expect(store.state.toolTerms.filter(tool => tool.identifier === 'cogAtlas:MOCA')[0]['selected']).to.be.true;
    });

});
