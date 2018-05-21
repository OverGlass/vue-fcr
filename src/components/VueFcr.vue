<template>
  <section>
    <fieldset v-for="f in flow" :key="f.id" v-show="f.isCall">
      <label :for="f.id"> {{ f.label }} </label>
      <input
        :id="f.id"
        type="text"
        v-model="storeResult[f.id]"
        :placeholder="f.placeholder"
      >
    </fieldset>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import _find from 'lodash/find'
import _pick from 'lodash/pick'
import _isArray from 'lodash/isArray'

  interface inCase {
    operator: string
    value: any  
  }
  
  interface conditionnalObject {
    ofInput: string
    inCase: inCase 
  }
  interface FieldObject {
    id: string
    type: string
    label: string
    placeholder: string
    value: any
    conditionnal: conditionnalObject | false
    [key: string]: any
  }
  
  interface StoreResult {
    [key:string]: any 
  }


const slug = (text:string):string => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

@Component
export default class VueFormCondionnalRendering extends Vue {
  // --------------------- 
  // ------- PROPS -------
  @Prop({
    type: Array,
    default: () => [
        { id: 0, type: 'text', label: 'Text Field', placeholder: 'Enter text type here', value: '', conditionnal: false },
        {
          id: 1,
          type: 'text',
          label: 'Text Field',
          placeholder: 'Enter text type here',
          value: 'test2',
          conditionnal: { ofInput: 0, inCase: { operator: '==', value: 'test' } }
        },
        {
          id: 2,
          type: 'text',
          label: 'Text Field',
          placeholder: 'Enter text type here',
          value: '',
          conditionnal: { ofInput: 1, inCase: { operator: '==', value: 'test2' } }
        }
      ]
  })
  fieldsInfos!: Array<FieldObject>

  @Prop({ type: Array, default: () => [] })
  customInputs!: Array<object>

  // --------------------- 
  // ------- DATA --------
  storeResult:StoreResult = this.initStoreResult()

  // --------------------- 
  // ------- METHODS -----

  /**
   * Init Store Result object.
   */
  initStoreResult (): object {
    return Object.assign({}, ...this.fieldsInfos.map(item => ({[item.id]: item.value})))
  }
  operator (value:any, op:string, b:any): boolean {
    if (!op) return true
    if (!_isArray(value)) {
      value = [value]
    } else {
      if (value.length !> 0) return false
    }
    return value.some((a:any) => {
      if (typeof a === 'string' && typeof b === 'string') {
        a = slug(a.toLowerCase())
        b = slug(b.toLowerCase())
      }
      switch (op) {
        case '==': return a === b
        case '~=': return (b.indexOf(a.length > 0 ? a : '#%#%#%#') >= 0)
        case '>': return a > b
        case '>=': return a >= b
        case '<': return a < b
        case '<=': return a <= b
        case '!=': return a != b
      }
    })
  }
  
  get flow () {
    return this.fieldsInfos
      // On map une première fois pour checker les call sur les conditions et les standalones
      .map((field, index) => {
        const conditionnal = field.conditionnal
        return {
          ...field,
          order: index,
          isCall: (conditionnal)
            ? this.operator(
                this.storeResult[conditionnal.ofInput],
                conditionnal.inCase.operator,
                conditionnal.inCase.value
              ) 
            : true
        }
      })
      // On map une deuxième fois pour savoir si le field parent est déjà appelé.
      .map((field, key, arr) => {
        const conditionnal = field.conditionnal
        const related = conditionnal ? _find(arr, ({id}) => id === conditionnal.ofInput) : false
        return {
          ...field,
          isCall: (related)
            ? field.isCall && related.isCall
            : field.isCall
        }
      })
      // .sort((a, b) => (a.conditionnal - b.conditionnal || b.is_conditionnal - a.is_conditionnal || a.order - b.order ))
      
  }
}
</script>
