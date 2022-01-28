<template>

	<div>
		<b-table
			bordered hover
			:fields="fields"
			id="column-paint-table"
			:items="tableData"
			primary-key="primary-key"
			@row-clicked="tableRowClick"
			select-mode="multi"
			:tbody-tr-class="paintClass">
		</b-table>

		<table></table>
	</div>

</template>

<script>

	export default {

		// computed: {

		// 	tsvIndex(){

		// 		let currentIndex = this.tsvIndexCounter;
		// 		this.tsvIndexCounter += 1;
		// 		return currentIndex;
		// 	}
		// },

		// data() {

		// 	return {

		// 		tsvIndexCounter: 0,
		//         testData: [

        //   			{ age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
        //   			{ age: 21, first_name: 'Larsen', last_name: 'Shaw' },
        //   			{
        //     			age: 89,
        //     			first_name: 'Geneva',
        //     			last_name: 'Wilson',
        //     			_rowVariant: 'danger'
        //   			},
        //   			{
        //     			age: 40,
        //     			first_name: 'Thor',
        //     			last_name: 'MacDonald',
        //     			_cellVariants: { age: 'info', first_name: 'warning' }
        //   			},
        //   			{ age: 29, first_name: 'Dick', last_name: 'Dunlap' }
        // 		]
				
		// 	}
		// },

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