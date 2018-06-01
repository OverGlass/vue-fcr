<template>
  <div id="app">
    <img src="./assets/logo.png">
    <VueFcr />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueFcr from './components/VueFcr';

@Component({
  components: { VueFcr },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
