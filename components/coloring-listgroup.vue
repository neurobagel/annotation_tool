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
				let itemText = clickedListGroupItem.innerText;

				// 2. Determine if clicked list group item will be colored or decolored
				let currentBackgroundColor = clickedListGroupItem.style.backgroundColor;
				let coloringItem = ( this.defaultPalette.bColor == currentBackgroundColor || 
									 "" == currentBackgroundColor );

				// NOTE: Blank style string means it is uncolored.
				// This occurs because Vue CSS is considered to be an external stylesheet
				// If needs for more dynamic CSS styling arises, may need to re-address

				// 3. Decolor all list group items
				let listGroup = document.getElementById(this.tag + "-listgroup");
				for ( let index = 0; index < listGroup.children.length; index++ ) {
					
					// A. Decolor the list group item
					listGroup.children[index].style.backgroundColor = this.defaultPalette.bColor;
					listGroup.children[index].style.color = this.defaultPalette.fColor;
				}

				// 4. Change the background and foreground colors of the clicked list group item
								
				// A. Color the clicked list group item
				if ( coloringItem ) {

					// I. Color the item
					clickedListGroupItem.style.backgroundColor = this.columnData.backgroundColors[itemIndex];
					clickedListGroupItem.style.color = this.columnData.foregroundColors[itemIndex];

					// II. Tell the parent page column painting has begun
					this.$emit("paint-action", {
						category: itemText,
						bColor:this.columnData.backgroundColors[itemIndex],
						fColor:this.columnData.foregroundColors[itemIndex]
					});
				} 
				// B. Else, decolor the clicked list group item
				else {

					// I. Uncolor the item
					clickedListGroupItem.style.backgroundColor = this.defaultPalette.bColor;
					clickedListGroupItem.style.color = this.defaultPalette.fColor;

					// II. Tell the parent page column painting has ended
					this.$emit("paint-action", {
						category:"",
						bColor:this.defaultPalette.bColor,
						fColor:this.defaultPalette.fColor
					});
				}
			}
		},

		props: ["columnData", "defaultPalette", "instructions", "title", "tag"]
	}

</script>

<style>

.instructions-text {

	color: grey;
	font-style: italic;
}

</style>