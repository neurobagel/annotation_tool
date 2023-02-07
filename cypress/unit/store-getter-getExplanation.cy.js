import { getters } from "~/store";

const store = {

    state: {

        categories: {

            "Age": { explanation: "Age explanation" },
            "Sex": { explanation: "Sex explanation" },
            "Diagnosis": { explanation: "Diagnosis explanation" }
        }
    }
};

describe("getExplanation", () => {

    it("Get explanation for Age category", () => {

        expect(getters.getExplanation(store.state)("Age")).to.equal("Age explanation");
    });

    it("Get explanation for Sex category", () => {

        expect(getters.getExplanation(store.state)("Sex")).to.equal("Sex explanation");
    });

    it("Get explanation for Diagnosis category", () => {

        expect(getters.getExplanation(store.state)("Diagnosis")).to.equal("Diagnosis explanation");
    });
});