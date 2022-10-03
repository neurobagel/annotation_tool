import AnnotDiscreteChoices from "./../../components/annot-discrete-choices.vue"; // import the component to test

// Props definitions

const props = {

    options: ["male", "female", "other"],
    relevantColumns: ["sex"],
    title: "Sex",
    uniqueValues: { "sex": ["M", "F"] }
};

// Injects

const injectMixin = {

    data: function() {

        return {

            dataTable: {

                original: [
                    {
                        "participant_id": "sub-718211",
                        "age": 28.4,
                        "sex": "M",
                        "group": "UD",
                        "group_dx": "MDD",
                        "number_comorbid_dx": 0,
                        "medload": 0,
                        "iq": 117.66,
                        "session": 1
                    },
                    {
                        "participant_id": "sub-718213",
                        "age": 24.6,
                        "sex":	"F",
                        "group": "UD",
                        "group_dx": "MDD",
                        "number_comorbid_dx": 0,
                        "medload": 0,
                        "iq": 109.08,
                        "session": 1
                    }
                ],

                annotated: [
                    {
                        "participant_id": "sub-718211",
                        "age": 28.4,
                        "sex": "M",
                        "group": "UD",
                        "group_dx": "MDD",
                        "number_comorbid_dx": 0,
                        "medload": 0,
                        "iq": 117.66,
                        "session": 1
                    },
                    {
                        "participant_id": "sub-718213",
                        "age": 24.6,
                        "sex":	"F",
                        "group": "UD",
                        "group_dx": "MDD",
                        "number_comorbid_dx": 0,
                        "medload": 0,
                        "iq": 109.08,
                        "session": 1
                    }
                ]
            },

            missingColumnValues: {},
            missingValueLabel: "missing value"
        };
    },

    methods: {

        isMissingValue: (p_columnName, p_value) => false,

        getOriginalColumnValue: (p_state) => (p_subjectID, p_columnName) => {

            for ( let index = 0; index < p_state.dataTable.original.length; index++ ) {

                if ( p_subjectID === p_state.dataTable.original[index]["participant_id"] ) {

                    return p_state.dataTable.original[index][p_columnName];
                }
            }

            return null;
        }
    }
};

describe("annot-discrete-choices.cy.js", () => {

    it("Selects discrete choices; tests save button status", () => {

        // 1. Mount the component
        cy.mount(AnnotDiscreteChoices, {

            propsData: props,
            mixins: [injectMixin],
            plugins: ["bootstrap-vue", "vue-select"]
        });

        // 2. Assert 'Save Annotation' button is disabled
        cy.assertButtonStatus("save-button-" + props.title, false);

        // 3. Select annotation choices for 'Sex' column values
        cy.get("[data-cy='discrete-select-" + props.title + "-0']").click().type(props.options[0] + "{enter}");
        cy.get("[data-cy='discrete-select-" + props.title + "-1']").click().type(props.options[1] + "{enter}");

        // 4. Assert 'Save Annotation' button is enabled
        cy.assertButtonStatus("save-button-" + props.title, true);
    });

    it("Selects discrete choices and saves annotation; tests save button status", () => {

        // 1. Mount the component
        cy.mount(AnnotDiscreteChoices, {

            propsData: props,
            mixins: [injectMixin],
            plugins: ["bootstrap-vue", "vue-select"]
        });

        // 2. Assert 'Save Annotation' button is disabled
        cy.assertButtonStatus("save-button-" + props.title, false);

        // 3. Select annotation choices for 'Sex' column values
        cy.get("[data-cy='discrete-select-" + props.title + "-0']").click().type(props.options[0] + "{enter}");
        cy.get("[data-cy='discrete-select-" + props.title + "-1']").click().type(props.options[1] + "{enter}");

        // 4. Assert 'Save Annotation' button is enabled
        cy.assertButtonStatus("save-button-" + props.title, true);

        // 5. Click on the 'Save Annotation' button
        cy.get("[data-cy='save-button-" + props.title + "']")
            .click();

        // 6. Assert 'Save Annotation' button is disabled
        cy.assertButtonStatus("save-button-" + props.title, false);
    });
});

// Plugins
// args.global = args.global || {}
// args.global.plugins = args.global.plugins || []
// args.global.plugins.push(createPinia())
// args.global.plugins.push(createI18n())