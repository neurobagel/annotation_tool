<template>

    <b-row>
        <b-col cols="6">

            <!-- Heading for tool grouping component -->
            <b-row>
                <h3>{{ uiText.title }}</h3>
            </b-row>

            <!-- Instructions prompting the user how to group tools -->
            <b-row>
                <p class="instructions-text">
                    {{ uiText.instructions }}
                </p>
            </b-row>

            <!-- Tool grouping inputs -->

            <!-- Tool group name -->
            <b-row>
                <b-input-group>
                    <label for="tool-name-textbox">Group name:&nbsp;</label>
                    <b-form-input
                        id="tool-name-textbox"
                        v-model="newToolGroupName"
                        :placeholder="uiText.toolGroupNamePlaceholder" />
                </b-input-group>
            </b-row>

            <!-- Columns in tool group -->
            <b-row>
                <b-input-group>
                    <label for="column-multiselect">Columns:&nbsp;</label>
                    <b-form-select
                        id="column-multiselect"
                        v-model="selectedTools"
                        multiple
                        :options="columnOptions()"
                        :select-size="4" />
                </b-input-group>
            </b-row>

            <!-- Create new tool group button -->
            <b-row>
                <b-col cols="4">
                    <!-- Error message - only visible if duplicate group name is entered -->
                    <p v-if="invalidNameEntered" class="instructions-text">
                        {{ uiText.alreadyExistsText }}
                    </p>
                </b-col>
                <b-col class="no-padding-right" ols="8">
                    <b-button
                        class="float-right"
                        :disabled="!readyToAddToolGroup"
                        variant="info"
                        @click="createToolGroup()">
                        {{ uiText.createToolGroupButton }}
                    </b-button>
                </b-col>
            </b-row>

        </b-col>

        <b-col cols="6">

            <!-- Tool grouping table -->
            <b-table
                bordered
                head-variant="dark"
                :items="assessmentToolGroups.items"
                :fields="assessmentToolGroups.fields">

                <!-- Blank row for empty table for aesthetics -->
                <template #top-row v-if="hasNoGroups">
                    <!-- Adding &nbsp; to the cell so that it maintains the standard cell height -->
                    <td
                        v-for="index in assessmentToolGroups.fields.length"
                        :key="assessmentToolGroups.fields[index]">
                            &nbsp;
                    </td>
                </template>

                <!-- Remove row button -->
                <template #cell(action)="row">
                    <b-button
                        class="float-right"
                        variant="danger"
                        @click="removeToolGroup(row)">
                        {{ uiText.removeToolGroupButton }}
                    </b-button>
                </template>
            </b-table>

        </b-col>

    </b-row>

</template>

<script>

    export default {

        props: {

            columnNames: { type: Array, required: true },
            columnToCategoryMap: { type: Object, required: true }
        },

        data() {

            return {

                assessmentToolGroups: {

                    items: [],
                    fields: [
                        {
                            key: "name",
                            label: "Name",
                            type: "text",
                            editable: true,
                            placeholder: "Enter Name..."
                        },
                        {
                            key: "toolList",
                            label: "Tools",
                            type: "text",
                            editable: false
                        },
                        {
                            key:"action",
                            label:" ",
                            type: "text"
                        }
                    ]
                },

                newToolGroupName: "",

                selectedTools: [],

                toolGroups: {},

                uiText: {

                    alreadyExistsText: "Group already exists in table",
                    createToolGroupButton: "+ Create Tool Group",
                    instructions: "Choose a name and columns and then click the 'create' button",
                    removeToolGroupButton: "x Remove Tool Group",
                    title: "Assessment Tool Groups",
                    toolGroupNamePlaceholder: "Type name of assessment tool group here..."
                }
            };
        },

        computed: {

            hasNoGroups() {

                // Table is blank if it has just the default blank entry
                return ( 0 === this.assessmentToolGroups.items.length );
            },

            invalidNameEntered() {

                // Duplicate group names are not allowed
                return ( this.newToolGroupName in this.toolGroups );
            },

            readyToAddToolGroup() {

                // A new tool group can be added if a new name has been entered
                // and there are at least one columns selected
                return ( "" !== this.newToolGroupName &&
                    this.selectedTools.length > 0 &&
                    !Object.prototype.hasOwnProperty.call(this.toolGroups, this.newToolGroupName) );
            }
        },

        methods: {

            columnOptions() {

                // Only columns categorized as assessment tools can be grouped together
                let options = [];
                for ( const columnName in this.columnToCategoryMap ) {

                    if ( "Assessment Tool" === this.columnToCategoryMap[columnName] ) {
                        options.push({

                            // Columns cannot be grouped twice.
                            // A column is disabled from selection once grouped.
                            disabled: this.isToolAlreadyGrouped(columnName),
                            text: columnName,
                            value: columnName
                        });
                    }
                }

                return options;
            },

            createToolGroup() {

                // 1. Create a new entry for a new tool group
                this.assessmentToolGroups.items.push({

                    name: this.newToolGroupName,
                    toolList: this.selectedTools.join(", ")
                });

                // 2. Save this group to the tool group map
                this.toolGroups[this.newToolGroupName] = [...this.selectedTools];

                // 3. Clear the tool group input fields
                this.newToolGroupName = "";
                this.selectedTools = [];
            },

            isToolAlreadyGrouped(p_columnName) {

                let foundTool = false;

                // 1. Look for tool name in the table
                for ( const item of this.assessmentToolGroups.items ) {
                    
                    // A. Look for tool name in this group's tools
                    const toolNames = item.toolList.split(", ");
                    if ( toolNames.includes(p_columnName) ) {
                        foundTool = true;
                        break;
                    }
                }

                return foundTool;
            },

            removeToolGroup(p_row) {

                // 1. Clear this group's row in the table
                let groupIndex = this.assessmentToolGroups.items.findIndex(x => x.name === p_row.item.name);
                this.assessmentToolGroups.items.splice(groupIndex, 1);

                // 2. Remove this group from the tool group map
                delete this.toolGroups[p_row.item.name];
            }
        }
    }

</script>

<style>

    .no-padding-right {

        padding-right: 0;
    }

</style>