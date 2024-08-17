import { ModelProperty } from "@typespec/compiler";
import { Method } from "@alloy-js/java";
import { TypeExpression } from "./type-expression.js";


export interface ModelMemberProps {
  type: ModelProperty;
  memberGetAndSetMethod: boolean;
}

export function ModelMember({type, memberGetAndSetMethod} : ModelMemberProps) {
  /**
   * In our simple tsp file with a model like:
   * model Task {
   *   name: string;
   *   description: string;
   * }
   * It seems that name: string; and description: string; are collected as type ModelProperty, these
   * are stored as the values in the properties map from Model. These ModelProperties also have a
   * type. With this format: description: string; the ModelProperty.name is "description" and the
   * ModelProperty.type.name is "string". The ModelProperty.type.kind is scalar, in the type-expression.tsx
   * we handle taking this ModelProperty.type.name and getting a representation for it in java.
   * */

  //todo: Fix naming, Method component does not correctly set the name to camelCase for some reason.
  if (memberGetAndSetMethod) {
    const returnType = <TypeExpression type={type.type}></TypeExpression>;
    const setParams: Record<string, string> = {[type.name]: returnType};
    const getter = <Method name={"get" + type.name} return={returnType} accessModifier={"public"}>{`return ${type.name};`}</Method>
    const setter = <Method name={"set" + type.name} return={returnType} accessModifier={"public"} parameters={setParams}>{`this.${type.name} = ${type.name};`}</Method>
    return<>{getter}{`\n`}{setter}</>
  }

  return<><TypeExpression type={type.type}></TypeExpression> {type.name};</>
}


