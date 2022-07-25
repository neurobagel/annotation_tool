// Description of task: User clicks on the 'download file' button
// Expected results: File is verified as downloaded

describe("download-file", () => {
    it("Passes through basic upload, categorization, annotation, and downloads a csv file", () => {

        // Setup

        // Get past the annotation page
        cy.passAnnotation();

        // Act

        // Click the download button
        cy.get("[data-cy='download-button']")
            .click();

        // Assert

        // Verify csv file download
        cy.verifyDownload(".json", { contains: true });
    });
});