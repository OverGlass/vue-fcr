import { Component, Vue, Prop } from 'vue-property-decorator';
import { slug } from '../lib'
import _find from 'lodash/find'
import _pick from 'lodash/pick'
import _isArray from 'lodash/isArray'

@Component
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
        type: 'select',
        element: 'input',
        props: {
          name: ':id',
          payload: { title: ':label', items: ':options' }
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
        formCls: ['Fcr-form'],
        formContainerCls: ['Fcr-form-container'],
        formContainerFieldSetCls: ['Fcr-form-container-fieldset']
      }
    }) 
  })
  config!: ConfigObject
  
  // --------------------- 
  /**
   * Store the form responses by fields id
   *
   * @type {StoreResult}
   * @memberof VueFormCondionnalRendering
   */
  storeResult:StoreResult = this.initStoreResult()

  // --------------------- 
  // ------- METHODS -----
  
   /**
   * Init Store Result object.
   *
   * @returns {object}
   * @memberof VueFormCondionnalRendering
   */
  initStoreResult (): object {
    return Object.assign({}, ...this.fieldsInfos.map(item => ({[item.id]: item.value})))
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
      const related = conditionnal ? _find(arr, ({id}) => id === conditionnal.ofInput) : false
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
  formConditionnalRendering (h:any) {
    const { formCls, formContainerCls, formContainerFieldSetCls } = this.config.classesName
    return (
      <form class={formCls}>
        {/* FORM CONDITIONAL RENDERING */
          this.flow.map((f) => (
            <div class={formContainerCls}>
            {/* FCR-HEADER SLOT */}
            { this.$slots.formHeader }

            <fieldset key={f.id} v-show={f.isCall}  class={formContainerFieldSetCls}>
              <label for={f.id}> { f.label } </label>
              {
                this.storeResult 
                  ? <input
                    id={f.id}
                    type="text"
                    on-input={(e:InputEvent) => { this.storeResult[f.id] = e.currentTarget.value} }
                    value={this.storeResult[f.id]}
                    placeholder={f.placeholder} />
                  : null
              }
            </fieldset>
            {/* FCR-FOOTER SLOT */}
            { this.$slots.formFooter }
          </div>
          ))
        }
      </form>
    )
  }

  render (h:any) {
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
