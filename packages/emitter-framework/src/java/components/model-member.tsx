import { ModelProperty, Type } from "@typespec/compiler";
import * as jv from "@alloy-js/java";
import { useJavaNamePolicy } from "@alloy-js/java";
import { TypeExpression } from "./type-expression.js";


export interface ModelMemberProps{
  type: ModelProperty;
}

export function ModelMember({type} : ModelMemberProps) {
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
  return(
    <>
      <TypeExpression type={type.type}></TypeExpression> {type.name};
    </>
  )
}


