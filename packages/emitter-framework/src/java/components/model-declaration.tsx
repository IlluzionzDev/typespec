import * as jv from "@alloy-js/java";
import * as ay from "@alloy-js/core";

import { FunctionDeclaration, InterfaceMember } from "../../typescript/index.js";
import { code, mapJoin } from "@alloy-js/core";
import { Model, ModelProperty, Operation, Type } from "@typespec/compiler";
import { isInterface, isModel } from "../../core/index.js";
import { ModelMember } from "./model-member.js";

export interface ModelDeclarationProps {
  type: Model;
}

export function ModelDeclaration(props: ModelDeclarationProps) {
  const fields = fieldsFromType(props);
  return (
    <jv.Class name={props.type.name}>
      {fields}
    </jv.Class>
  )
}

function fieldsFromType(props: ModelDeclarationProps) {
  // Define the iterable for properties
  const typeMembers = props.type.properties.values();

  // Use mapJoin to iterate and create JSX for each ModelProperty
  return mapJoin(Array.from(typeMembers), (property) => {
    if ("name" in property.type && property.type.name === 'string') {
      return <jv.Variable name={property.name} type={property.type.name}></jv.Variable>;
    }
    return null; // Return null if the condition is not met
  }, { joiner: "\n" });
}

