import { ModelProperty, Type } from "@typespec/compiler";
import * as jv from "@alloy-js/java";


export interface ModelMemberProps{
  type: ModelProperty;
}

export function ModelMember({type} : ModelMemberProps) {
  let fieldType;
  if ("name" in type.type && type.type.name === 'string') {
    fieldType = type.type.name;
  }
  return(
    <jv.Variable name={type.name} type={fieldType}></jv.Variable>
  )
}
