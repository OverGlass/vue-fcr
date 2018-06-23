// random salt prop inject

import { VNode } from 'vue'
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { slug } from '../lib'
import isArray from 'lodash/isArray'
import find from 'lodash/find'
import isString from 'lodash/isString'
import InputRenderer from './InputRenderer'


// options operator

@Component({
  components: { InputRenderer }
})
export default class VueFormCondionnalRendering extends Vue {

  // --------------------- 
  /**
   * props for all informations
   * about fields data and condition
   *
   * @type {Array<FieldObject>}
   * @memberof VueFormCondionnalRendering
   */
  @Prop({
    type: Array,
    default: () => [
      { 
        id: 0,
        type: 'number',
        defaultValue: 5,
        conditionnal: false,
        data: {
            label: 'Text Field',
            placeholder: 'Enter text type here' 
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
      {
        id: 2,
        type: 'text',
        defaultValue: '',
        conditionnal: { ofInput: 1, inCase: { operator: '===', value: 'test2' } },
        data: {
          label: 'Text Field',
          placeholder: 'Enter text type here' 
        }
      },
      {
        id: 3,
        type: 'text',
        defaultValue: '',
        conditionnal: { ofInput: 2, inCase: { operator: '===', value: 'test3' } },
        data: {
          label: 'Text Field',
          placeholder: 'Enter text type here' 
        }
      }
    ]
  })
  fieldsInfos!: Array<FieldObject>

  /**
   * prop for customs inputs
   * Element or component that 
   * accept v-model
   * @type {Array<CustomInput>}
   * @memberof VueFormCondionnalRendering
   */
  @Prop({
    type: Array,
    default: () => [
      {
        type: 'number',
        element: 'input',
        component: false,
        attrs: {
          title: 'number filed',
          type: 'number',
          placeholder: ':placeholder'
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
    ]
  })
  customInputs!: Array<CustomInputs>

  /**
   * Contain aside configuration
   * like style and some behaviour
   * @type {ConfigObject}
   * @memberof VueFormCondionnalRendering
   */
  @Prop({ 
    default: () => ({
      classesName: {
        containerCls: ['Fcr'],
        formContainerCls: ['Fcr-container'],
      }
    }) 
  })
  config!: ConfigObject

  @Prop({
    default: null
  })
  input!: StoreResult
  
  // --------------------- 
  /**
   * Store the form responses by fields id
   *
   * @type {StoreResult}
   * @memberof VueFormCondionnalRendering
   */
  storeResult:StoreResult = this.initStoreResult()
  storeIsInit:Boolean = false

  // --------------------- 
  // ------- METHODS -----
  
   /**
   * Init Store Result object.
   *
   * @returns {object}
   * @memberof VueFormCondionnalRendering
   */
  initStoreResult () {
      return Object.assign({}, ...this.fieldsInfos.map(item => ({[item.id]: item.defaultValue})))
  }

  @Watch('storeResult', { immediate: true, deep: true })
  onStoreChange () {
    this.$emit('output', this.storeResult)
  }

  @Watch('input')
  onInputChange () {
    if (this.input) this.storeResult = this.input
  }

  /**
   * Do some operation between two values
   *
   * @param {*} value
   * @param {string} op
   * @param {*} b
   * @returns {boolean}
   * @memberof VueFormCondionnalRendering
   */
  operator (value:any, op:string, b:any): boolean {
    if (!op) return true
    if (!isArray(value)) value = [value]
    if (value.length === 0) return false
    return value.some((a:any) => {
      if (isString(a) && isString(b)) {
        a = slug(a)
        b = slug(b)
      }
      switch (op) {
        case '===': return a === b
        case '==': return a == b
        case '>': return a > b
        case '>=': return a >= b
        case '<': return a < b
        case '<=': return a <= b
        case '!=': return a != b
      }
    })
  }
  /**
   * Get flatten conditionnal params of fieldObject
   * 
   * @param {FieldObject} {conditionnal}
   * @returns {(Array<any> | null)}
   * @memberof VueFormCondionnalRendering
   */
  getConditionnalParams ({conditionnal}:FieldObject): Array<any> | null {
    return (conditionnal)
      ? [
        this.storeResult[conditionnal.ofInput],
        conditionnal.inCase.operator,
        conditionnal.inCase.value
      ]
      : null
  }
  /**
   * Know if one field isCall
   *
   * @param {FieldObject} field
   * @returns
   * @memberof VueFormCondionnalRendering
   */
  isFieldCall (field:FieldObject) {
    return this.operator.apply(this, this.getConditionnalParams(field))
  }

  /**
   * Map fieldsInfos to know which field is call
   *
   * @readonly
   * @memberof VueFormCondionnalRendering
   */
  get flow () {
    return this.fieldsInfos
    // On map une première fois pour definir isCall  
    .map((field, index, arr) => {
      const conditionnal = field.conditionnal
      const related = conditionnal ? find(arr, ({id}) => id === conditionnal.ofInput) : false
      const thisIsCall = conditionnal ? this.isFieldCall(field) : false
      const relatedIsCall = related ? this.isFieldCall(related) : false
      return {
        ...field,
        order: index,
        isCall: (conditionnal)
          ? thisIsCall && (related && related.conditionnal)
            ? relatedIsCall
            : thisIsCall
          : true
      }
    })
  }

 
  /**
   * Rendering the form with data flow
   * with the isCall condition bool prop
   * set custom style and slots
   * @param {*} h
   * @returns
   * @memberof VueFormCondionnalRendering
   */
  formConditionnalRendering (h:VNode) {
    const { formCls, formInputContainerCls } = this.config.classesName
    return (
      <form class={formCls}>
        {/* FORM CONDITIONAL RENDERING */
         !this.$scopedSlots.default
          ? this.flow.map((f) => (
              <div key={f.id} v-show={f.isCall}  class={formInputContainerCls}>
                {
                  this.storeResult
                    ? <input-renderer 
                        field={f}
                        customInputs={this.customInputs}
                        on-input={(value:any) => { this.storeResult[f.id] = value }}
                        value={this.storeResult[f.id]}
                      />
                    : null
                }
              </div>
            ))
          : this.$scopedSlots.default({
            dataFlow: this.flow,
            storeResult: this.storeResult,
            customInputs: this.customInputs
          })
        }
      </form>
    )
  }
/**
 *
 *
 * @param {VNode} h
 * @returns jsx
 * @memberof VueFormCondionnalRendering
 */
render (h:VNode) {
    const { containerCls } = this.config.classesName
    return (
     <section class={containerCls}>
      { this.$slots.header}
      { this.formConditionnalRendering(h) }
      { this.$slots.footer} 
     </section> 
    )
  }
}
