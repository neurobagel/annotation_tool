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
					v-for="(column, index) in categoryData.names"
					v-on:click="colorListGroupItem"
					:class="['category-style-' + index, 'coloring-listgroup-item']"
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

		data() {

			return {

				clickedOpacity: "1.0",
				defaultOpacity: "0.5"
			}
		},

		methods: {

			colorListGroupItem(p_event) {

				// 1. Get the list group item element
				let clickedListGroupItem = document.getElementById(p_event.target.id);
				let itemIndex = parseInt(p_event.target.id.split("_")[1])
				let itemText = clickedListGroupItem.innerText;

				let styleObject = window.getComputedStyle(clickedListGroupItem);
				console.log("Computed background color for clicked list group item: " + styleObject.getPropertyValue('background-color'));
				console.log("Computed color for clicked list group item: " + styleObject.getPropertyValue('color'));
				

				// 2. Determine if clicked list group item will be opaque or transparent
				let currentOpacity = clickedListGroupItem.style.opacity;
				let makingItemOpaque = ( this.defaultOpacity == currentOpacity || 
									 "" == currentOpacity );

				// NOTE: Blank style string means it is unstyled.
				// This occurs because Vue CSS is considered to be an external stylesheet
				// If needs for more dynamic CSS styling arises, may need to re-address

				// 3. Make all list group items transparent
				let listGroup = document.getElementById(this.tag + "-listgroup");
				for ( let index = 0; index < listGroup.children.length; index++ ) {
					
					// A. Make the list group item transparent
					listGroup.children[index].style.opacity = this.defaultOpacity;
				}

				// 4. Make the clicked list group item opaque or transparent
								
				// A. Make the clicked list group item opaque
				if ( makingItemOpaque ) {

					// I. Make the item opaque
					clickedListGroupItem.style.opacity = this.clickedOpacity;

					// II. Tell the parent page column painting has begun
					this.$emit("paint-action", {

						category: itemText,
						bColor:this.categoryData.backgroundColors[itemIndex],
						fColor:this.categoryData.foregroundColors[itemIndex]
					});
				} 
				// B. Else, make the clicked list group item transparent
				else {

					// I. Make the item transparent
					clickedListGroupItem.style.opacity = this.defaultOpacity;

					// II. Tell the parent page column painting has ended
					this.$emit("paint-action", {

						category: "",
						bColor: this.defaultPalette.bColor,
						fColor: this.defaultPalette.fColor
					});
				}
			}
		},

		props: ["categoryData", "defaultPalette", "instructions", "title", "tag"]
	}

</script>

<style>

.instructions-text {

	color: grey;
	font-style: italic;
}

</style>