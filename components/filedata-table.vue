<template>

	<div>
		<b-table
			bordered striped hover selectable
			:items="tableData"
			@row-clicked="tableRowClick"
			select-mode="multi">
		</b-table>
	</div>

</template>

<script>

	export default {

		data() {

			return {

				pastClickColor: "white",
		        testData: [

          			{ age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
          			{ age: 21, first_name: 'Larsen', last_name: 'Shaw' },
          			{
            			age: 89,
            			first_name: 'Geneva',
            			last_name: 'Wilson',
            			_rowVariant: 'danger'
          			},
          			{
            			age: 40,
            			first_name: 'Thor',
            			last_name: 'MacDonald',
            			_cellVariants: { age: 'info', first_name: 'warning' }
          			},
          			{ age: 29, first_name: 'Dick', last_name: 'Dunlap' }
        		]
			}
		},

		methods: {

			tableRowClick(p_event) {

				console.log("Row click event object");
				console.log(p_event);
			}
		},

		props: ["clickColor", "tableData"]
	}

</script>

<style>

</style>