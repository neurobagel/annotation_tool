# Annotation Tool

<div align="center">
    <a href="https://github.com/neurobagel/annotation_tool/actions/workflows/pages/pages-build-deployment">
        <img src="https://img.shields.io/website?down_color=CD5C5C&down_message=down&label=deployed%20app&style=flat-square&up_color=B0C4DE&up_message=live&url=https%3A%2F%2Fannotate.neurobagel.org%2F" alt="deployed app"></a>
    <a href="https://github.com/neurobagel/annotation_tool/actions/workflows/test_component.yml">
        <img src="https://img.shields.io/github/actions/workflow/status/neurobagel/annotation_tool/test_component.yml?color=BDB76B&label=component test&style=flat-square" alt="component test"></a>
    <a href="https://github.com/neurobagel/annotation_tool/actions/workflows/test_e2e.yml">
        <img src="https://img.shields.io/github/actions/workflow/status/neurobagel/annotation_tool/test_e2e.yml?color=8FBC8F&label=e2e test&style=flat-square" alt="e2e test"></a>
	<a href="https://nodejs.org/en//">
        <img src="https://img.shields.io/badge/node-20.9.0-CD5C5C?style=flat-square" alt="Node"></a>
    <a href="https://nuxtjs.org/">
        <img src="https://img.shields.io/badge/nuxt-2.17.2-F0FFF0?style=flat-square" alt="Nuxt"></a>
    <a href="https://vuejs.org/">
        <img src="https://img.shields.io/badge/vue-2.7.15-D8BFD8?style=flat-square" alt="Vue"></a>
    <a href="LICENSE">
        <img src="https://img.shields.io/github/license/neurobagel/query-tool?color=4682B4&style=flat-square" alt="GitHub license"></a>
    <a href="https://doi.org/10.5281/zenodo.8088067">
        <img src="https://zenodo.org/badge/DOI/10.5281/zenodo.8088067.svg" alt="Zenodo DOI"></a>
</div>
        
<br>

[Neurobagel's](https://www.neurobagel.org/) annotation tool takes BIDS-style [phenotypic data](https://github.com/neurobagel/annotation_tool/blob/main/cypress/fixtures/examples/good/ds003653_participant.tsv) and [corresponding data description files](https://github.com/neurobagel/annotation_tool/blob/main/cypress/fixtures/examples/good/ds003653_participant.json) and gives users the ability to annotate their data using the Neurobagel data model for preparation to inject that modeled data into Neurobagel's graph database for [federated querying](https://github.com/neurobagel/query-tool).

The annotation tool is a Vue application, developed in [JavaScript](https://www.javascript.com/) using a variety of tools including [Nuxt](https://nuxtjs.org/), [Cypress](https://www.cypress.io/), and [BootstrapVue](https://bootstrap-vue.org/docs).

Please refer to our [**official documentation**](https://neurobagel.org/annotation_tool/) for more information on how to use the annotation tool.

[Quickstart](#quickstart) |
[Documentation](https://neurobagel.org/annotation_tool/) |
[Local Installation](#local-installation) |
[Workflow](#workflow) |
[Testing](#testing) |
[License](#license)

## Quickstart

The latest (stable) version of the annotation tool is hosted at [https://annotate.neurobagel.org/](https://annotate.neurobagel.org/).

The nightly (unstable) version of the annotation tool is hosted at [https://neurobagel-annotator.netlify.app/](https://neurobagel-annotator.netlify.app/).


## Local Installation

### Building and running

```bash
# Install dependencies
$ npm install

# Serve with hot reload at localhost:3000
$ npm run dev

# Build for production and launch server
$ npm run build
$ npm run start

# Generate static project
$ npm run generate
```
### Deployment

To deploy the static build on GH pages, run

```bash
npm run generate
npm run deploy
```

See the [Nuxt documentation](https://nuxtjs.org/deployments/github-pages/) for more details.

## Workflow

1. Upload data table (and/or data dictionary)
2. Link columns you want annotated with Neurobagel metadata categories
3. Annotate the values of the those categirzed columns
4. Download an annotated version of a BIDS-style data dictionary for your dataset

There are two means of moving forward to the next step in the annotation tool's workflow: (1) the <span style="color:green;">navbar</span> at the top right of the screen which features the page names, and (2) the <span style="color:green;">next page buttons</span> on the bottom right of each page.

Certain criteria for each page need to be be met in order to move forward. Instructions are offered above the <span style="color:green;">next page button</span>. Once the criteria have been met <span style="color:green;">navbar</span> and <span style="color:green;">next page button</span> will turn from gray to green.

## Testing

The Annotation tool uses [Cypress](https://www.cypress.io/) for integration, component, and unit testing. See the [cypress folder](https://github.com/neurobagel/annotation_tool/tree/main/cypress) for tests, custom commands, and test data.

## License

The Neurobagel Annotation tool uses the [MIT License](https://github.com/neurobagel/annotation_tool/blob/main/LICENSE).
