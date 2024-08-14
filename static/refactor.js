const fs = require('fs');

// Load measurementTerms.json
const measurementTerms = JSON.parse(fs.readFileSync('static/measurementTerms.json', 'utf8'));

// Convert terms to dictionary format
const toolTerms = {};
measurementTerms.forEach((term) => {
  toolTerms[term.identifier] = term.label;
});

// Save toolTerms to new file
const toolTermsJson = JSON.stringify(toolTerms, null, 2);
fs.writeFileSync('static/convertedmTerms.json', toolTermsJson);