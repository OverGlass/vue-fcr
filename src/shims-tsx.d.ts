import Vue, { VNode } from 'vue'
import Component from 'vue-class-component';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }

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
    defaultValue: any
    data: Object,
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
    formInputContainerCls: Array<string>
  }

  interface ConfigObject {
    classesName: ClassesNameObject
  }

  interface CustomInputs {
    type: string | Array<string>,
    element: string | false,
    component: object | false,
    [key: string]: any
    attrs: {
      [elem: string]: any
    }
    props: {
      [elem: string]: any
    }
  }

  type InputEvent = Event & {currentTarget: HTMLInputElement};
}
