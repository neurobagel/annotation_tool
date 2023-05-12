import { getters } from "~/store";

let store = {

    getters: getters,

    state: {

        appSetting: { termURLPrefix: "prefix" },
        categoricalOptions: {

            "category1": [
                { label: "option_0", identifier: "https://example.org/option_0"},
                { label: "option_1", identifier: "https://example.org/option_1"}
            ]
        },
        columnToCategoryMap: {

            "column1": "category1"
        },

        dataDictionary: {
            annotated: {
                valueMap: { "rawValue1": "annotatedValue1" }
            }
        }
    }
};

describe("getCategoricalJsonOutput", () => {

    it("IsAbout test", () => {

        store = {};
    });

    it("Levels test", () => {

    });
});