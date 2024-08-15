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
  const members = membersFromType(props);
  return (
    <jv.Class name={props.type.name}>
      {members}
    </jv.Class>
  )
}

function membersFromType(props: ModelDeclarationProps) {
  // Define the iterable for properties
  const typeMembers = props.type.properties.values();

  // Use mapJoin to iterate and create JSX for each ModelProperty
  return mapJoin(Array.from(typeMembers), (member) => (
    <ModelMember type={member} />
  ), { joiner: "\n" });
}

