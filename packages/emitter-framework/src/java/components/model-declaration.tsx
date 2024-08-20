import * as jv from "@alloy-js/java";
import { mapJoin } from "@alloy-js/core";
import { Model} from "@typespec/compiler";
import { ModelMember } from "./model-member.js";
import { ModelConstructor } from "./model-constructor.js";
import { Constructor } from "@alloy-js/java";

export interface ModelDeclarationProps{
  type: Model;
}

export function ModelDeclaration(props: ModelDeclarationProps) {
  const body = getBody(props);

  return<jv.Class name={props.type.name}>{body}
  </jv.Class>
}


function modelParameterizedConstructor(props: ModelDeclarationProps) {
  const typeMembers = props.type.properties.values();

  return<ModelConstructor types={Array.from(typeMembers)}/>
}


function gettersAndSettersFromType(props: ModelDeclarationProps) {
  const typeMembers = props.type.properties.values();

  return mapJoin(Array.from(typeMembers), (member) => (
    <ModelMember type={member} memberGetAndSetMethod={true} />
  ), { joiner: "\n" });
}


function membersFromType(props: ModelDeclarationProps) {
  const typeMembers = props.type.properties.values();

  return mapJoin(Array.from(typeMembers), (member) => (
    <ModelMember type={member} memberGetAndSetMethod={false} />
  ), { joiner: "\n" });
}


//There may be a cleaner implementation but this gets the job done for now.
function getBody(props: ModelDeclarationProps) {
  const members = membersFromType(props);
  const gettersAndSetters = gettersAndSettersFromType(props)
  const parameterizedConstructor = modelParameterizedConstructor(props);
  const constructor = <Constructor accessModifier={"public"}></Constructor>

  return<>{members}{`\n\n`}{constructor}{`\n\n`}{parameterizedConstructor}{`\n\n`}{gettersAndSetters}</>
}

