<template>
  <div>
    <b-card no-body class="mb-1">
      <b-card-header header-tag="header" class="p-1" role="tab">
        <b-button block v-b-toggle.accordion-explanation variant="info">{{ card_title }}</b-button>
      </b-card-header>
      <b-collapse id="accordion-explanation" accordion="my-accordion" role="tabpanel">
        <b-card-body>
          <b-card-text>{{ explanation }}</b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
  </div>
</template>

<script>
export default {
  name: "sub-explanation",
  data() {
    return {
      card_title: "Explanation",
    }
  },
  props: {
    explanation: {
      type: String,
      default: "No explanation has been provided yet."
    },
  }
}
</script>

<style scoped>

</style>
