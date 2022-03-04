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
					v-for="(category, index) in categories"
					v-on:click="changeListGroupItemOpacity"
					:class="[
						$store.getters.cssStylePrefix + index,
						listGroupItemClass,
						( 0 == index ) ? 'opaque' : 'transparent']"
					:id="tag + '_' + index"
					:key="index"
					:ref="tag + '_' + index">
					{{ category }}
				</b-list-group-item>
			</b-list-group>
		</b-row>

	</b-container>

</template>

<script>

	export default {

		data() {

			return {

				listGroupItemClass: "coloring-listgroup-item",

				// Preset opacity values for swapping opacities on click
				// Default opacities are set via initial class
				opacities: {

					clicked: "1.0",
					default: "0.5"
				},

				// Index of most recently clicked list group item
				clickedIndex: 0
			}
		},

		methods: {

			changeListGroupItemOpacity(p_event) {

				// 1. Get the list group item element
				let clickedListGroupItem = document.getElementById(p_event.target.id);
				let itemIndex = parseInt(p_event.target.id.split("_")[1])

				// A. Short-circuit out of clicking on the same category
				if ( itemIndex == this.clickedIndex )
					return;
			
				// B. Save the row index of this, the most recently clicked category
				this.clickedIndex = itemIndex;

				// 2. Determine if clicked list group item will be opaque or transparent
				let currentOpacity = clickedListGroupItem.style.opacity;
				let makingItemOpaque = ( this.opacities.default == currentOpacity || 
									 	 "" == currentOpacity );

				// NOTE: Blank style string means it is unstyled.
				// This occurs because Vue CSS is considered to be an external stylesheet
				// If needs for more dynamic CSS styling arises, may need to re-address

				// 3. Make all list group items transparent
				let listGroup = document.getElementById(this.tag + "-listgroup");
				//let listGroup = this.$refs["tag + '-listgroup'"].$el;
				for ( let index = 0; index < listGroup.children.length; index++ ) {
					
					// A. Make the list group item transparent
					listGroup.children[index].style.opacity = this.opacities.default;
				}

				// 4. Make the clicked list group item opaque or transparent
								
				// A. Make the clicked list group item opaque
				if ( makingItemOpaque ) {

					// I. Make the item opaque
					clickedListGroupItem.style.opacity = this.opacities.clicked;

					// II. Tell the parent page column painting has begun
					this.$emit("category-select", {

						categoryIndex: itemIndex,
					});
				}
			}
		},

		props: ["categories", "instructions", "title", "tag"]
	}

</script>

<style scoped>

.instructions-text {

	color: grey;
	font-style: italic;
}

</style>