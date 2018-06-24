<template>
<div @keydown="handleKey">
  <vue-fcr
    @output="data => fcrStore = data"
    :input="fcrStore"
    :fields-infos="fieldsInfos"
    :customInputs="customInputs"
    @keyup.enter.prevent="this.up = false"
    style="display: flex; align-items: center; justify-content: center; height: 100vh"
  >
    <template slot-scope="{ dataFlow }">
      <transition-group name="slide" tag="div">
        <div
          v-for="(field) in (fullForm ? dataFlow : (stop ? moveCallList(dataFlow, up) : lastInputCall(dataFlow)))"
          :key="field.id"
          v-if="fcrStore && field.isCall"
        >
          <input-renderer
            :field="field"
            v-focus
            v-model="fcrStore[field.id]"
            :customInputs="customInputs"
          />
        </div>
      </transition-group>
      <button @click.prevent="triggerUp(true)">up</button>
      <button @click.prevent="triggerUp(false)">down</button>
      <button @click.prevent="stop = false">ok</button>
      <button @click.prevent="fullForm = !fullForm">{{ fullForm ? 'hide' : 'show' }}</button>
    </template>
  </vue-fcr>
</div>
</template>
<script>
import { VueFcr, InputRenderer } from '../index.ts'
import find from 'lodash/find'
import findIndex from 'lodash/findIndex'
import findLast from 'lodash/findLast'
import findLastIndex from 'lodash/findLastIndex'
const fieldsInfos = require('./fieldsInfos.json')
import vSelect from 'vue-select'
export default {
  components: { VueFcr, InputRenderer, vSelect },
  data () {
    return {
      up: null,
      stop: false,
      fcrStore: null,
      fullForm: false,
      activeField:null,
      fieldsInfos,
      customInputs: [
      {
        type: 'number',
        element: 'input',
        attrs: {
          title: 'number filed',
          type: 'number',
          placeholder: ':placeholder'
        },
      },
      {
        type: 'text',
        element: 'input',
        attrs: {
          title: 'number field',
          type: 'text',
          placeholder: ':placeholder'
        },
      },
      {
        type: 'select',
        component: vSelect,
        props: {
          name: ':id',
          payload: { title: 'label', items: 'options' }
        }
      }
    ]
    }
  },
  directives: {
    focus: {
      // définition de la directive
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    handleKey (event) {
      if(event.shiftKey && event.keyCode == 9) {
        this.triggerUp(true)
      } else if (event.keyCode == 9) {
         this.triggerUp(false)
      }
    },
    triggerUp (bool) {
      this.up = !bool
      this.stop = true
    },
    lastInputCall (flow, overide) {
      if(flow && flow[0]) {
        const lastIndex = findLastIndex(flow, el => el.isCall)
        const last = flow[lastIndex]
        this.activeField = {...last, currentPosition: lastIndex}
        return [last]
      }
      return []
    },
    moveCallList (flow, up = true) {
      if (up === null) return [this.activeField]
      this.up = null
      const index = up
        ? findIndex(flow, (el, i) => el.isCall && this.activeField.currentPosition < i)
        : findLastIndex(flow, (el, i) => el.isCall && this.activeField.currentPosition > i)
      
      if (index === -1) return [this.activeField]
      const input = flow[index]
      this.activeField = {...input, currentPosition: index}
      console.log(input)
      return [input]
    }
  }
}
</script>

<style scoped>
  .slide-leave-active,
  .slide-enter-active {
    transition: 1s;
  }
  .slide-enter {
    transform: translate(100%, 0);
  }
  .slide-leave-to {
    transform: translate(-100%, 0);
  }

</style>

