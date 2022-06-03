<template>

    <b-row style="margin-bottom: 0;">
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
                        :disabled="!readyToAddOrModifyToolGroup"
                        variant="info"
                        @click="( modes.create === currentMode ) ? createToolGroup() : modifyToolGroup()">
                        {{ currentModeText() }}
                    </b-button>
                </b-col>
            </b-row>

        </b-col>

        <b-col cols="6">

            <b-row>
                <!-- Tool grouping table -->
                <b-table
                    bordered
                    selectable
                    head-variant="dark"
                    ref="table"
                    select-mode="single"
                    :items="assessmentToolGroups.items"
                    :fields="assessmentToolGroups.fields"
                    @row-selected="selectTableRow($event)">

                    <!-- Blank row for empty table for aesthetics -->
                    <template #top-row v-if="hasNoGroups">
                        <!-- Adding &nbsp; to the cell so that it maintains the standard cell height -->
                        <td
                            v-for="field in assessmentToolGroups.fields"
                            :key="field.key">
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
            </b-row>

        </b-col>

    </b-row>

</template>

<script>

    // Allows for reference to store data by creating simple, implicit getters
    import { mapGetters } from "vuex";

    export default {

        props: {

            columnNames: { type: Array, required: true }
        },

        inject: [

            "columnToCategoryMap",
            "toolGroups"
        ],

        data() {

            return {

                assessmentToolGroups: {

                    items: [],
                    fields: [
                        {
                            key: "name",
                            label: "Group Name",
                            type: "text",
                            placeholder: "Enter Name..."
                        },
                        {
                            key: "toolList",
                            label: "Tools",
                            type: "text"
                        },
                        {
                            key:"action",
                            label: " ",
                            type: "text"
                        }
                    ]
                },

                currentGroup: "",
                currentMode: "create",

                modes: {

                    create: "create",
                    modify: "modify"
                },

                newToolGroupName: "",

                selectedTools: [],

                uiText: {

                    alreadyExistsText: "Group already exists in table",
                    createToolGroupButton: "+ Create Tool Group",
                    instructions: "Enter a name, choose columns, and then click the 'create' button",
                    modifyToolGroupbutton: "~ Modify Tool Group",
                    removeToolGroupButton: "x Remove Tool Group",
                    title: "Assessment Tool Groups",
                    toolGroupNamePlaceholder: "Type name of assessment tool group here..."
                }
            };
        },

        computed: {

            ...mapGetters([

                "getGroupOfTool",
                "isToolGrouped"
            ]),

            hasNoGroups() {

                // Table is blank if it has just the default blank entry
                return ( 0 === this.assessmentToolGroups.items.length );
            },

            invalidNameEntered() {

                // Name cannot be a duplicate of another tool group
                let invalid = ( this.newToolGroupName in this.toolGroups );

                // With the exception of the current group being edited while in 'modify' mode
                if ( this.modes.modify === this.currentMode ) {
                    invalid = invalid && this.currentGroup !== this.newToolGroupName;
                }

                return invalid;
            },

            readyToAddOrModifyToolGroup() {

                // 1. Minimum ready condition check

                // A. The entered group name must not be blank and there must be
                // at least one tool selected
                let ready = ( "" !== this.newToolGroupName &&
                    this.selectedTools.length > 0 );

                // B. Short-circuit out if this condition is not met
                if ( !ready ) {
                    return false;
                }

                // 2. Mode-specific additional condition check
                switch ( this.currentMode ) {

                    case this.modes.create:

                        // No duplicate group names allowed
                        ready = ( ready &&
                            !Object.hasOwn(this.toolGroups, this.newToolGroupName) );
                        break;

                    case this.modes.modify:

                        // No duplicate group names, but skip check for the
                        // name of the group currently being modified
                        for ( const groupName in this.toolGroups ) {

                            if ( groupName === this.newToolGroupName &&
                                groupName !== this.currentGroup ) {
                                ready = false;
                                break;
                            }
                        }
                        break;
                }

                return ready;
            }
        },

        watch: {

            columnToCategoryMap: {

                deep: true,
                handler(p_newColumnToCategoryMap, p_oldColumnToCategoryMap) {

                    // Note: `newValue` will be equal to `oldValue` here
                    // on nested mutations as long as the object itself
                    // hasn't been replaced.

                    // 1. Check to see if any columns have been unlinked as assessment tools
                    const toBeRemoved = [];
                    for ( const item of this.assessmentToolGroups.items ) {

                        const toolArray = item.toolList.split(", ");
                        for ( const tool of toolArray ) {

                            if ( null === this.columnToCategoryMap[tool] ) {
                                toBeRemoved.push(tool);
                            }
                        }
                    }

                    // 2. Remove the recently unlinked columns from the tool groups in the store
                    for ( const groupName in this.toolGroups ) {
                        for ( const column of toBeRemoved ) {
                            if ( this.toolGroups[groupName].includes(column) ) {

                                this.$emit("remove-tool-from-group", {
                                    tool: column,
                                    group: groupName
                                });
                            }
                        }
                    }

                    // 3. If any tool group is empty, remove it from the store
                    for ( const groupName in this.toolGroups ) {
                        if ( 0 === this.toolGroups[groupName].length ) {

                            this.removeToolGroup({ item: { name: groupName }});
                        }
                    }

                    // 4. Update the tool group data with changes
                    this.refreshToolGroupTable();
                }
            }
        },

        mounted() {

            // Initialize the interface based on the contents of toolGroups in
            // the store by populating the tool group table
            this.refreshToolGroupTable();
        },

        methods: {

            columnOptions() {

                const options = [];

                // 1. Determine availability of columns for selection
                for ( const columnName in this.columnToCategoryMap ) {

                    if ( "Assessment Tool" == this.columnToCategoryMap[columnName] ) {

                        let disabledStatus = true;

                        // A. Columns are available if they are not already grouped,
                        // OR if in 'modify' mode if they are part of the
                        // current group being modified
                        if ( (this.modes.modify === this.currentMode &&
                            this.currentGroup === this.getGroupOfTool(columnName)) ||
                            !this.isToolGrouped(columnName) ) {

                            disabledStatus = false;
                        }

                        // B. Note that available columns are added in the order
                        // they are listed in the column linking table on the
                        // categorization page
                        options.push({

                            disabled: disabledStatus,
                            text: columnName,
                            value: columnName
                        });
                    }
                }

                return options;
            },

            currentModeText() {

                return ( this.modes.create === this.currentMode ) ?
                    this.uiText.createToolGroupButton : this.uiText.modifyToolGroupbutton;
            },

            createToolGroup() {

                // 1. Create a new entry for a new tool group
                this.assessmentToolGroups.items.push({

                    name: this.newToolGroupName,
                    toolList: this.selectedTools.join(", ")
                });

                // 2. Tell the categorization page a new tool group has been created
                this.$emit("tool-group-action", {

                    action: "createToolGroup",
                    data: {
                        name: this.newToolGroupName,
                        tools: this.selectedTools
                    }
                });

                // 3. Mode stays in 'create' but input fields are cleared
                this.switchMode(this.modes.create, {});
            },

            modifyToolGroup() {

                // 1. Find item in table data and modify it
                const groupIndex = this.assessmentToolGroups.items.findIndex(groupData =>
                    this.currentGroup === groupData.name);
                this.$set(this.assessmentToolGroups.items[groupIndex], "name", this.newToolGroupName);
                this.$set(this.assessmentToolGroups.items[groupIndex], "toolList", this.selectedTools.join(", "));

                // 2. Tell the categorization page a tool group has been modified
                this.$emit("tool-group-action", {

                    action: "modifyToolGroup",
                    data: {

                        name: this.newToolGroupName,
                        previousName: this.currentGroup,
                        tools: this.selectedTools
                    }
                });

                // 3. Switch back to 'create' mode
                this.switchMode(this.modes.create, {});

                // 4. Deselect table row
                this.$refs.table.clearSelected();
            },

            refreshToolGroupTable() {

                // 1. Make sure the items list is clear
                this.assessmentToolGroups.items = [];

                // 2. Build the tool group table data based on the current store values
                for ( const toolGroup in this.toolGroups ) {

                    this.assessmentToolGroups.items.push({

                        name: toolGroup,
                        toolList: this.toolGroups[toolGroup].join(", ")
                    });
                }
            },

            removeToolGroup(p_row) {

                // 1. Clear this group's row in the table
                let groupIndex = this.assessmentToolGroups.items.findIndex(x => x.name === p_row.item.name);
                this.assessmentToolGroups.items.splice(groupIndex, 1);

                // 2. Remove this group from the tool group map
                this.$emit("tool-group-action", {

                    action: "removeToolGroup",
                    data: {
                        name: p_row.item.name
                    }
                });
            },

            switchMode(p_mode, p_data) {

                if ( this.modes.create === p_mode ) {

                    // 1. Clear the tool group input fields
                    this.newToolGroupName = "";
                    this.selectedTools = [];

                    // 2. Set the mode back to 'create'
                    this.currentMode = this.modes.create;

                    // 3. Clear field indicating current group being edited
                    this.currentGroup = "";
                } else if ( this.modes.modify === p_mode ) {

                    // 1. Set mode to 'modify' mode
                    this.currentMode = this.modes.modify;

                    // 2. Save the group name for saving edits later
                    this.currentGroup = p_data.name;

                    // 3. Populate textbox with selected group's name
                    this.newToolGroupName = p_data.name;
                }
            },

            selectTableRow(p_eventData) {

                // Deselecting a table row switches to 'create' mode
                if ( 0 === p_eventData.length ) {
                    this.switchMode(this.modes.create, {});
                }
                // Selecting a table row switches to 'modify' mode
                else {
                    this.switchMode(this.modes.modify, p_eventData[0]);
                }
            }
        }
    };

</script>

<style>

    .no-padding-right {

        padding-right: 0;
    }

</style>