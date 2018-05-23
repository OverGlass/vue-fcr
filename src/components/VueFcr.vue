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
import { throws } from 'assert';

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
          conditionnal: { ofInput: 0, inCase: { operator: '===', value: 'test' } }
        },
        {
          id: 2,
          type: 'text',
          label: 'Text Field',
          placeholder: 'Enter text type here',
          value: '',
          conditionnal: { ofInput: 1, inCase: { operator: '===', value: 'test2' } }
        },
        {
          id: 3,
          type: 'text',
          label: 'Text Field',
          placeholder: 'Enter text type here',
          value: '',
          conditionnal: { ofInput: 2, inCase: { operator: '===', value: 'test3' } }
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
    if (!_isArray(value)) value = [value]
    if (value.length === 0) return false
    return value.some((a:any) => {
      if (typeof a === 'string' && typeof b === 'string') {
        a = slug(a)
        b = slug(b)
      }
      switch (op) {
        case '===': return a === b
        case '>': return a > b
        case '>=': return a >= b
        case '<': return a < b
        case '<=': return a <= b
        case '!=': return a != b
      }
    })
  }

  getConditionnalParams ({conditionnal}:FieldObject): Array<any> | null {
    return (conditionnal)
      ? [
        this.storeResult[conditionnal.ofInput],
        conditionnal.inCase.operator,
        conditionnal.inCase.value
      ]
      : null
  }

  isFieldCall (field:FieldObject) {
    return this.operator.apply(this, this.getConditionnalParams(field))
  }
  
  get flow () {
    return this.fieldsInfos
      // On map une première fois pour checker les call sur les conditions et les standalones
      .map((field, index, arr) => {
        const conditionnal = field.conditionnal
        const related = conditionnal ? _find(arr, ({id}) => id === conditionnal.ofInput) : false
        const thisIsCall = conditionnal ? this.isFieldCall(field): false
        const relatedIsCall = related ? this.isFieldCall(related) : false
        return {
          ...field,
          order: index,
          isCall: (conditionnal)
            ? thisIsCall && ((related && related.conditionnal)
                ? relatedIsCall
                : thisIsCall)
            : true
        }
      })
      // .sort((a, b) => (a.conditionnal - b.conditionnal || b.is_conditionnal - a.is_conditionnal || a.order - b.order ))
      
  }
}
</script>
