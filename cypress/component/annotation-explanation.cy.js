import annotExplanation from "~/components/annot-explanation";

describe('explanation', () => {

    it('starts collapsed', () => {
        cy.mount(annotExplanation);
        cy.get('.card-body').should('be.hidden');
    });

    it('expands when clicked and collapsed when clicked again', () => {
        cy.mount(annotExplanation);
        cy.get('.btn').click();
        cy.get('.card-body').should('be.visible');
        cy.get('.btn').click();
        cy.get('.card-body').should('not.be.visible');
    });

    it('displays default when no explanation provided', () => {
        cy.mount(annotExplanation);
        cy.get('.card-body').contains('No explanation has been provided yet');
    });

    it('displays explanation when one is provided', () => {
        cy.mount(annotExplanation, {
            propsData: {
                 explanation: "show me this explanation"
            }
        });
        cy.get('.card-body').contains('show me this explanation');
    });

});
