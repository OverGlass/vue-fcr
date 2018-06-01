import { Component, Vue, Prop } from 'vue-property-decorator';
// import { varNameToString } from '../lib'
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

  interface ClassesNameObject {
    containerCls: Array<string>,
    formCls: Array<string>,
    formContainerCls: Array<string>,
    formContainerFieldSetCls: Array<string>
  }

  interface ConfigObject {
    classesName: ClassesNameObject
  }

  declare type InputEvent = Event & {currentTarget: HTMLInputElement};

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
  // ------- DATA --------
  storeResult:StoreResult = this.initStoreResult()
  
  // ---------------------
  // ------ utilities ----
  
  
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
