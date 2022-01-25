<template>

	<b-container>

		<b-row>
			<h3>{{ title }}</h3>
		</b-row>

		<b-row>
			<p class="instructions-text">{{ instructions }}</p>
		</b-row>

		<b-row>
			<b-list-group :id="tag + '-listgroup'">
				<b-list-group-item 
					v-for="(column, index) in columnData.names"
					v-on:click="colorListGroupItem"
					:id="tag + '_' + index"
					:key="index">
					{{ column }}
				</b-list-group-item>
			</b-list-group>
		</b-row>

	</b-container>

</template>

<script>

	import { BListGroup, BListGroupItem } from "bootstrap-vue";

	export default {

		components: {

			"b-list-group": BListGroup,
			"b-list-group-item": BListGroupItem
		},

		methods: {

			colorListGroupItem(p_event) {

				// 1. Get the list group item element
				let clickedListGroupItem = document.getElementById(p_event.target.id);
				let itemIndex = parseInt(p_event.target.id.split("_")[1])

				// 2. Determine if clicked list group item will be colored or decolored
				let currentBackgroundColor = clickedListGroupItem.style.backgroundColor;
				let coloringItem = ( this.columnData.defaultBackgroundColor == currentBackgroundColor || 
									 "" == currentBackgroundColor );

				// NOTE: Blank style string means it is uncolored.
				// This occurs because Vue CSS is considered to be an external stylesheet
				// If needs for more dynamic CSS styling arises, may need to re-address

				// 3. Decolor all list group items
				let listGroup = document.getElementById(this.tag + "-listgroup");
				for ( let index = 0; index < listGroup.children.length; index++ ) {
					
					// A. Decolor the list group item
					listGroup.children[index].style.backgroundColor = this.columnData.defaultBackgroundColor;
					listGroup.children[index].style.color = this.columnData.defaultForegroundColor;
				}

				// 4. Change the background and foreground colors of the clicked list group item
								
				// A. Color the clicked list group item
				if ( coloringItem ) {

					clickedListGroupItem.style.backgroundColor = this.columnData.backgroundColors[itemIndex];
					clickedListGroupItem.style.color = this.columnData.foregroundColors[itemIndex];
				} 
				// B. Else, decolor the clicked list group item
				else {

					clickedListGroupItem.style.backgroundColor = this.columnData.defaultBackgroundColor;
					clickedListGroupItem.style.color = this.columnData.defaultForegroundColor;
				}

				// 5. Emit background color change to parent/listeners
				this.$emit("listgroupitem-click", clickedListGroupItem.style.backgroundColor);
			}
		},

		props: ["columnData", "instructions", "title", "tag"]
	}

</script>

<style>

.instructions-text {

	color: grey;
	font-style: italic;
}

</style>