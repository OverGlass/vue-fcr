import { VNode } from 'vue'
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Throttle } from 'lodash-decorators';
import { isEmpty, isArray, find, isString, isObject, get, mapValues } from 'lodash'

@Component
export default class InputRenderer extends Vue {
  /**
   * prop for customs inputs
   * Element or component that 
   * accept v-model
   * @type {Array<CustomInput>}
   * @memberof VueFormCondionnalRendering
   */
  @Prop({
    type: Object,
    default: () => ({
      type: 'text',
      element: 'input',
      component: false,
      attrs: {
        title: 'text fild',
        type: 'text'
      },
      props: {
        name: ':id',
        payload: { items: ':options' }
      }
    })
  })
  field!:FieldObject

  @Prop({ type: [String, Number, Array, Object, Symbol] })
  value!:any

  @Prop({
    type: Array,
    default: () => [
      {
        type: 'number',
        element: 'input',
        component: false,
        attrs: {
          title: 'number filed',
          type: 'number'
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

  defaultInput:CustomInputs = {
    type: 'text',
    element: 'input',
    component: false,
    attrs: {
      title: 'text fild',
      type: 'text'
    },
    props: {
      name: ':id',
      payload: { items: ':options' }
    }
  }

  getInputByType (type:string):CustomInputs {
    // find input by type
    if(type && this.customInputs && isArray(this.customInputs) && !isEmpty(this.customInputs)) {
      let input = find(this.customInputs, ci => ci.type === type)
      if (input) return input
    }
    return this.defaultInput
  }

  isPropKey (key:string) {
    return (isString(key) && key.charAt(0) === ':')
  }

  injectDataToProps (props:object, data:any):any {
    if (!props) return props
    const maping = (props:object, data:any) :any => mapValues(props, (key /* props */) => {
        return isObject(data)
          ? (isObject(key))
            ? maping(key, data)
            : (this.isPropKey(key) ? get(data, key) : key)
          : undefined
    })
    return maping(props, data)
  }
  @Throttle(128)
  emitInput(value:any) {
    this.$emit('input', value) 
  }

  render (h:VNode) {
    const input = this.getInputByType(this.field.type)
    const getPropsOrattrs = (key:string) => this.injectDataToProps(input[key], this.field.data)
    const propsAndattrs = {
      props: getPropsOrattrs('props'),
      attrs: getPropsOrattrs('attrs')
    }
    if (input.component) {
      return (
        <component
          { ...propsAndattrs }
          is={input.component}
        />
      )
    } else if (input.element) {
      return (
          <input.element
            { ...propsAndattrs }
            on-input={(e:InputEvent) => { this.emitInput(e.currentTarget.value)} }
            value={this.value}
          />
      )
    }

  }

}