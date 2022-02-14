<template>

	<div class="card">
		<b-table
			bordered hover
			:fields="fields"
			head-variant="dark"
			id="column-paint-table"
			:items="tableData"
			primary-key="primary-key"
			@row-clicked="tableRowClick"
			select-mode="multi"
			:tbody-tr-class="paintClass">
		</b-table>

	</div>

</template>

<script>

	export default {

		methods: {	

			tableRowClick(p_item, p_index) {

				// 0. Get this element
				let itemID = "column-paint-table" + "__row_" + p_item["primary-key"];
				let tableRow = document.getElementById(itemID);

				// 1. Determine if this item is to be colored or uncolored
				if ( this.defaultPalette.bColor == tableRow.style.backgroundColor ||
					 "" == tableRow.style.backgroundColor ) {
					tableRow.style.backgroundColor = this.currentPalette.bColor;
					tableRow.style.color = this.currentPalette.fColor;
				} else {
					tableRow.style.backgroundColor = this.defaultPalette.bColor;
					tableRow.style.color = this.defaultPalette.fColor;
				}

				// 2. Send the column name back to the parent to link it with the current category
				this.$emit("column-name-selected", this.tableData[p_index]);
			}
		},

		props: ["currentPalette", "defaultPalette", "fields", "paintClass", "tableData"]
	}

</script>