<template>
  <Tester />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Tester from './components/Tester.vue'

export default defineComponent({
  name: 'App',
  components: {
    Tester
  }
})
</script>

<style>
html, body, #app {
  height: 100%;
}
</style>
