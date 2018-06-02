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

  interface CustomInputs       {
    type: string | Array<string>,
    element: string,
    component: object,
    props: {
      [elem: string]: any
    }
  }

  type InputEvent = Event & {currentTarget: HTMLInputElement};
}
