# vue-fcr

> A Vue.js form conditionnal rendering component that will provides similar functionality to typeform
> Vue-Fcr 0.2.2 is experimental, the code base will often change until 1.0.0
> visual/dynamix exemple and custom operator come soon

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
import { VueFcr } from 'vue-fcr'
Vue.component('Vue-Fcr', VueFcr)
```

You may now use the component in your markup
basic usage

```html
<template>
  <vue-fcr />
</template>
```

Pass your custom inputs

```html
<template>
  <vue-fcr
    :customInputs="customInputs"
  />
</template>

<script>
import vSelect from 'vue-select'
export default {
  components: { vSelect }
  data () {
    return {
      customInputs: [
        {
          // this is your type, it can be evrything (if it correspond to your data)
          type: 'mytypenumber', 

          // html element input, textarea, range, checkbox....
          element: 'input', 

          // element attributes - please don't set attr value here
          attrs: {

            // reel html input type here
            type: 'number', 
            title: 'Number field',

            // if ':' is the first charter, 
            // vue-fcr will search in your data object - inputsInfo - placeholder propertie
            // it can be a string path like 'foo.fii[0]'
            placeholder: ':placeholder' 
          },
        },
        {
          type: 'text',
          element: 'input',
          attrs: {
            title: 'text field',
            type: 'text',
            placeholder: ':placeholder'
          },
        },
        {
          type: 'select',

          // component - no need element prop here
          // your component need to support v-model 
          component: vSelect,

          // your props
          props: {
            name: ':id',
            payload: { title: ':label', items: ':options' }
          }
        }
    ]
    }
  }

```

import your data with fields-infos

```html
<template>
  <vue-fcr
    :customInputs="customInputs"
    :fields-infos="fieldsInfos"
  />
</template>

<script>
export default {
  data () {
    return {
      customInputs: [...],
      fieldsinfos: [
        {
          id: 0, 
          type: 'mytypenumber',
          // init input / element with this value
          defaultValue: '',

          // field standalone
          conditionnal: false,

          // your data
          // in attrs and props in your custom components you can
          // acess to this data object with ':' in front of your data props name.
          /*
            attrs: {
              placeholder: ':placeholder' // === 'type10'
          },
          */
         // if your data prop is nested
         /*
            attrs: {
              title: ':label.good' // === 'Nice input !'
          },
          */ 
          data: {
            labels: {
              good: 'Nice input !'
              bad: 'Eww input !'
            },
            placeholder: 'type 10'
          }
        },
        {
          id: 1,
          type: 'text',
          defaultValue: '',
          // this input will be call by vue-fcr if
          // input id: 0 value == 10
          conditionnal: {
            ofInput: 0,
            inCase: {
              operator: '==', // '==' '===' '!==' ...
              value: 10
            }
          },
          data: {
            label: 'Text Field',
            placeholder: 'type test2'
          }
        },
        {
          id: 2,
          type: 'select',
          defaultValue: '',
          conditionnal: {
            ofInput: 1,
            inCase: {
              operator: '===',
              value: 'test2'
            }
          },
          data: {
            label: 'Text Field',
            placeholder: 'Enter text type here'
          }
        }
      ]
    }
  }

```

Store form result

```html
<template>
  <vue-fcr
    :customInputs="customInputs"
    :fields-infos="fieldsInfos"
    @output="formResult => fcrStore = formResult"
  />
</template>

<script>

export default {
  data () {
    return {
      customInputs: [...],
      fieldsinfos: [...],
      // set fcrStore to null, vueFcr will init it
      // fcrStore look like this
      /*
        {
          inputId: value,
          inputId: value,
          ...
        }
      */
      fcrStore: null
    }
  }

```

use template if you want more control on inputs display


```html
<template>
  <vue-fcr
    :fields-infos="fieldsInfos"
    @output="formResult => fcrStore = formResult"
    :input="fcrStore">  <!-- bind your store -->
      <template slot-scope="{ dataFlow }"> <!-- dataFlow is inputsComponent with isCall prop -->
          <!-- if isCall is true conditionnal field will display -->
          <div
            v-if="fcrStore && field.isCall"
            v-for="field in dataFlow"
            :key="field.id"
          >
            <!-- this component will render your custom component with the good data and store input value in fcrStore --> 
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
  import { VueFcr, InputRenderer } from 'vue-fcr'
Vue.component('vue-fcr', VueFcr)
Vue.component('input-renderer', InputRenderer)
export default {
  data () {
    return {
      customInputs: [...],
      fieldsinfos: [...],
      fcrStore: null
    }
  }

```