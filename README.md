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
Vue.component('Vue-Fcr', VueFcr)
```

You may now use the component in your markup

```html
<vue-fcr
  @output="store"
  :fieldsInfos="[
      { 
        id: 0,
        type: 'number',
        defaultValue: 5,
        conditionnal: false,
        data: {
            label: 'Text Field',
            placeholder: 'Enter text type here'
            //any thing you want
        }
      },
      {
        id: 1,
        type: 'text',
        defaultValue: 'test2',
        conditionnal: { ofInput: 0, inCase: { operator: '==', value: 10 } },
        data: {
          label: 'Text Field',
          placeholder: 'Enter text type here' 
        }
      },
      ...
  ]"
  :customInputs="[
    {
      type: 'number',
      element: 'input',
      component: false,
      attrs: {
        title: 'number filed',
        type: 'number',
        placeholder: ':placeholder' // link to data fieldsInfos[i].data.placeholder
      },
      props: {
        name: ':id',
        type: 'number',
        payload: { title: ':label', items: ':options' }
      }
    },
    {
      type: 'text',
      element: 'input',
      component: false,
      attrs: false,
      props: {
        name: ':id',
        payload: { title: 'label', items: 'options' }
    }
  }
]"
  :config="{
    classesName: {
        containerCls: ['Fcr'],
        formCls: ['Fcr-form'],
        formContainerCls: ['Fcr-form-container'],
        formInputContainerCls: ['Fcr-form-input-container']
    }
  }" />
```