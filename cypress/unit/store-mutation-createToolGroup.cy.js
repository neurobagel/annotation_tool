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

    it("Makes sure an annotated value is set in the value map", () => {

        // Act
        mutations.createToolGroup(store.state, { identifier: 'cogAtlas:MOCA', label: 'MOCA' });
        console.log(store.state.toolTerms);
        // Assert
        expect(store.state.toolTerms.filter(tool => tool.identifier === 'cogAtlas:MOCA')[0]['selected']).to.be.true;
    });

});