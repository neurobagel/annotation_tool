<template>

	<div id="filedata-table" class="card">
		<b-table
			bordered
			:fields="fields"
			head-variant="dark"
			:id="tableID"
			:items="tableData"
			primary-key="primary-key"
			@row-clicked="tableRowClick"
			select-mode="multi">
		</b-table>

	</div>

</template>

<script>

	export default {

		methods: {

			styleTable() {

				// 0. Quick references to the category column map and tsv data
				let categoryColumnMap = this.$store.getters.categoryColumnMap;
				let tsvTable = this.$store.getters.tsvDataTableFormatted;

				// 1. Need to wipe out style classes here and replace them with default
				for ( let index = 0; index < tsvTable.length; index++ ) {
					
					// A. Set each row to either default or custom style, depending on the category column map
					let rowKey = this.tableID + "__row_" + index.toString();
					let row = document.getElementById(rowKey);
					
					// B. Clear old style classes out of the class list for this row
					let styleClassList = Object.values(this.$store.getters.getStyleClass);
					for ( let index2 = 0; index2 < styleClassList.length; index2++ ) {

						if ( row.classList.contains(styleClassList[index2]) ) {
							row.classList.remove(styleClassList[index2]);
						}
					}

					// C. Add in the default or category-linked class
					let columnID = tsvTable[index].column;
					if ( columnID in categoryColumnMap ) {
						let tsvCategory = this.$store.getters.categoryColumnMap[columnID].tsvCategory;
						row.classList.add(this.$store.getters.getStyleClass[this.$store.getters.categoryToColorMap[tsvCategory.toString()]]);
					} else {
						row.classList.add(this.$store.getters.getStyleClass["colorDefault"])
					}
				}
			},	

			tableRowClick(p_item, p_index) {

				// 0. Get this element
				let itemID = this.tableID + "__row_" + p_item["primary-key"];
				let tableRow = document.getElementById(itemID);

				// 1. Determine if this item is to be colored or uncolored
				if ( tableRow.classList.contains(this.defaultStyleClass) ) {

					// A. Replace the default style class name with the desired new style
					tableRow.classList.replace(this.defaultStyleClass, this.currentStyleClass);
				} else {

					// A. If a category style class exists, replace it with the desired new style
					let oldStyleClass = "";
					for ( let index = 0; index < tableRow.classList.length; index++ ) {

						if ( -1 != tableRow.classList[index].indexOf(this.$store.getters.cssStylePrefix) ) {

							oldStyleClass = tableRow.classList[index];
							break;
						}
					}

					// B. Determine if category link is being replaced or column is being unlinked
					if ( oldStyleClass == this.currentStyleClass ) {
						tableRow.classList.replace(oldStyleClass, this.defaultStyleClass);
					} else {
						tableRow.classList.replace(oldStyleClass, this.currentStyleClass);
					}
				}

				// 3. Send the column name back to the parent to link it with the current category
				this.$emit("column-name-selected", this.tableData[p_index]);
			}
		},

		props: ["currentStyleClass", "defaultStyleClass", "fields", "tableData", "tableID"]
	}

</script>