<template>
  <vue-fcr
    @output="data => fcrStore = data"
    :input="fcrStore"
    :fields-infos="fieldsInfos"
    :customInputs="customInputs"
  >
    <template slot-scope="{ dataFlow, customInputs }">
      <div
        v-for="field in dataFlow"
        :key="field.id"
        v-if="fcrStore && field.isCall"
      >
        <input-renderer
          :field="field"
          v-model="fcrStore[field.id]"
          :customInputs="customInputs"
        />
      </div>
    </template>
  </vue-fcr>
</template>
<script>
import { VueFcr, InputRenderer } from '../index.ts'
const fieldsInfos = require('./fieldsInfos.json')
import vSelect from 'vue-select'
export default {
  components: { VueFcr, InputRenderer, vSelect },
  data () {
    return {
      fcrStore: null,
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
          title: ':label',
          type: 'text',
          placeholder: ':placeholder'
        }
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
}
</script>
