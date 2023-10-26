import { getters } from "~/store";

let store = {

    getters: getters,

    state: {
        dataDictionary:  {
            annotated:  {
                column1:  {
                  Description: "Some cool description here.",
                  missingValues: ["Missing"]
                }
            }
        },
        toolTerms: [
            {
                label: "MOCA",
                identifier: "cogAtlas:MOCA",
                selected: false
            }
        ],
        columnToToolMap: {
            column1: "cogAtlas:MOCA"
        }

    }
};

describe("getAssessmentToolJSONOutput", () => {

    it("Make sure Assessment tool json output is schema compliant", () => {

        // Act - Get formatted json output data for discrete value column
        const output = store.getters.getAssessmentToolJSONOutput(store.state)("column1");
        expect(output).to.deep.equal(
            {
            Annotations: {
                    IsAbout: {
                        "TermURL": "nb:Assessment",
                        "Label": "Assessment tool"
                    },
                    "IsPartOf": {
                        "TermURL": "cogAtlas:MOCA",
                        "Label": "MOCA"
                    },
                    MissingValues: ["Missing"]
                },
            Description: "Some cool description here."
        });
    });
});