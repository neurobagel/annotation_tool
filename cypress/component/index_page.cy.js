import indexPage from "~/pages/index.vue";
import fileSelector from "~/components/file-selector.vue";


const store = {
    getters: {
        isdataDictionaryLoaded: () => false,
        isDataTableLoaded: () => false,
        getColumnNames: () => [
                "participant_id",
                "age",
                "sex"
            ]
    },
    state: {

    }
};

describe("index page", () => {
    it("mounts", () => {
        cy.mount(indexPage, {
            mocks: {


                $store: store
            },
            computed: store.getters,
            stubs: {
                "file-selector": fileSelector
            },
            plugins: ["bootstrap-vue"]
            });
        }
    );
});
