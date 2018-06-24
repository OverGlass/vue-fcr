import { VNode } from 'vue'
import { Component, Vue, Prop } from 'vue-property-decorator';
import isEmpty from 'lodash/isEmpty'
import isArray from 'lodash/isArray'
import find from 'lodash/find'
import isString from 'lodash/isString'
import isObject from 'lodash/isObject'
import get from 'lodash/get'
import mapValues from 'lodash/mapValues'
import throttle from 'lodash/throttle'

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
    const maping = (props:object, data:any) :any => mapValues(props, (key:any /* props */) => {
        return isObject(data)
          ? (isObject(key))
            ? maping(key, data)
            : (this.isPropKey(key) ? get(data, key.substring(1)) : key)
          : undefined
    })
    return maping(props, data)
  }
  
  get emitInput() {
    return throttle((value:any) => {
      this.$emit('input', value) 
    }, 128)
  }

  render (h:VNode) {
    const input = this.getInputByType(this.field.type)
    const InputComponent:any = input.component
    const getPropsOrattrs = (key:string) => this.injectDataToProps(input[key], this.field.data)
    const propsAttrsListeners = {
      props: getPropsOrattrs('props'),
      attrs: {...getPropsOrattrs('attrs'), value: this.value},
      on: {...this.$listeners, input: (e:InputEvent) => { this.emitInput(e.currentTarget.value)}}
    }
    if (InputComponent) {
      return <InputComponent { ...propsAttrsListeners } />

    } else if (input.element) {
      return <input.element { ...propsAttrsListeners } />
    }

  }

}