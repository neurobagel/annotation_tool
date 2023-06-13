import { mutations } from "~/store";

describe("setDataDictionaryFilename", () => {

    it("Save the data dictionary's filename", () => {

        // Setup
        const store = {

            state: {

                dataDictionary: {

                    filename: ""
                }
            }
        };

        // Act
        mutations.setDataDictionaryFilename(store.state, "myfilename.txt");

        // Assert
        expect(store.state.dataDictionary.filename).to.be.eq("myfilename.txt");
    });
});