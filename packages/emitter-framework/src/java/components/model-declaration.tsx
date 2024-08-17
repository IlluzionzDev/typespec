import * as jv from "@alloy-js/java";
import * as ay from "@alloy-js/core";

import { FunctionDeclaration, InterfaceMember } from "../../typescript/index.js";
import { code, mapJoin } from "@alloy-js/core";
import { Model, ModelProperty, Operation, Type } from "@typespec/compiler";
import { isInterface, isModel } from "../../core/index.js";
import { ModelMember } from "./model-member.js";
import { ModelConstructor } from "./model-constructor.js";
import { ClassProps, DeclarationProps } from "@alloy-js/java";

export interface ModelDeclarationProps{
  type: Model;
}

export function ModelDeclaration(props: ModelDeclarationProps) {
  const members = membersFromType(props);
  const constructor = modelConstructor(props);
  return (
    <jv.Class name={props.type.name}>
    {members}
    {constructor}
    </jv.Class>
  )
}

function modelConstructor(props: ModelDeclarationProps) {
  const typeMembers = props.type.properties.values();
  return(
    <ModelConstructor properties={Array.from(typeMembers)}/>
  )
}


function membersFromType(props: ModelDeclarationProps) {
  const typeMembers = props.type.properties.values();

  return mapJoin(Array.from(typeMembers), (member) => (
    <ModelMember type={member} />
  ), { joiner: "" });
}

