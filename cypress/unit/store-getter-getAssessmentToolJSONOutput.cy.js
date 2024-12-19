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
                identifier: "snomed:MOCA",
                selected: false
            }
        ],
        columnToToolMap: {
            column1: "snomed:MOCA"
        }

    }
};

describe("getAssessmentToolJSONOutput", () => {

    it("Make sure Assessment tool json output is schema compliant", () => {

        const output = store.getters.getAssessmentToolJSONOutput(store.state)("column1");
        expect(output).to.deep.equal(
            {
            Annotations: {
                    IsAbout: {
                        "TermURL": "nb:Assessment",
                        "Label": "Assessment tool"
                    },
                    "IsPartOf": {
                        "TermURL": "snomed:MOCA",
                        "Label": "MOCA"
                    },
                    MissingValues: ["Missing"]
                },
            Description: "Some cool description here."
        });
    });
});