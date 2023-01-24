import { mutations } from "~/store";

let state = {};

describe('initializeDataDictionary', () => {
    beforeEach(() => {
        state = {
            dataTable: [
                { "col1": "val1", "col2": "val2" },
                { "col1": "val21", "col2": "val22" }
            ],
            dataDictionary: {
                annotated: {}
            }
        };
    });

    it('initializes a new data dictionary when none is defined', () => {
        mutations.initializeDataDictionary(state);

        expect(state.dataDictionary.annotated).to.deep.equal({
            "col1": {
                "description": ""
            },
            "col2": {
                "description": ""
            }
        });
    });
    it('overwrites existing data dictionary when one is already defined', () => {
        state.dataDictionary.annotated = {
            "this": "annotation",
            "is": "no longer needed"
        };
        mutations.initializeDataDictionary(state);

        expect(state.dataDictionary.annotated).to.deep.equal({
            "col1": {
                "description": ""
            },
            "col2": {
                "description": ""
            }
        });
    });
});
