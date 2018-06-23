# vue-fcr

> A Vue.js form conditionnal rendering component that will provides similar functionality to typeform

#### Features
- Import any components/elements in your form as input 
- Automatic conditionnal rendering
- Link your components with your data easly


## Install

###### Vue Compatibility
-  `vue ~2.5`

#### NPM
Install the package.

```bash
$ npm install vue-fcr
```

Register the component

```js
import Vue from 'vue'
import VueFcr from 'vue-fcr'
import { VueFcr, InputRenderer } from 'vue-fcr'
Vue.component('Vue-Fcr', VueFcr)
Vue.component('Input-Renderer', InputRenderer)
```

You may now use the component in your markup
basic usage

```html
<template>
  <vue-fcr
    @output="data => fcrStore = data"
    :input="fcrStore"
    :fields-infos="fieldsInfos"
    :customInputs="customInputs"
  />
</template>
<script>
import VueFcr from './VueFcr.tsx'
import InputRenderer from './InputRenderer.tsx'
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

```

or use template usefull for styling and form validation
base template here

```html
<template>
  <vue-fcr
    @output="data => fcrStore = data"
    :input="fcrStore"
    :fields-infos="fieldsInfos"
    :customInputs="customInputs"
  >
    <template slot-scope="{ dataFlow }">
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
import VueFcr from './VueFcr.tsx'
import InputRenderer from './InputRenderer.tsx'
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

```

data format for fields

```json
[
  {
    "id": 0,
    "type": "number",
    "defaultValue": 5,
    "conditionnal": false,
    "data": {
      "label": "Text Field",
      "placeholder": "Enter text type here"
    }
  },
  {
    "id": 1,
    "type": "text",
    "defaultValue": "test2",
    "conditionnal": {
      "ofInput": 0,
      "inCase": {
        "operator": "==",
        "value": 10
      }
    },
    "data": {
      "label": "Text Field",
      "placeholder": "Enter text type here"
    }
  },
  {
    "id": 2,
    "type": "select",
    "defaultValue": "",
    "conditionnal": {
      "ofInput": 1,
      "inCase": {
        "operator": "===",
        "value": "test2"
      }
    },
    "data": {
      "label": "Text Field",
      "placeholder": "Enter text type here"
    }
  }
]
```