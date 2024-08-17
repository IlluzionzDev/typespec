import { ModelProperty } from "@typespec/compiler";
import { TypeExpression } from "./type-expression.js";
import { Constructor } from "@alloy-js/java";
import { mapJoin } from "@alloy-js/core";
import { ConstructorMember } from "./constructor-member.js";

export interface ModelConstructorProps{
  types: ModelProperty[];
}

export function ModelConstructor(props : ModelConstructorProps) {

  const properties = props.types;
  const params = createTypeRecord(properties);
  const members = constructorMembersMapJoin(properties);

  return<Constructor parameters={params} accessModifier={'public'}>{members}</Constructor>
}

function createTypeRecord(properties: ModelProperty[]): Record<string, string> {
  const result: Record<string, string> = {};

  properties.forEach(property => {
    result[property.name] = getTypeExpression(property);
  });

  return result;
}

function getTypeExpression(property: ModelProperty) {
  return(
    <TypeExpression type={property.type}></TypeExpression>
  )
}

function constructorMembersMapJoin(properties: ModelProperty[]) {

  return mapJoin(Array.from(properties), (property) => (
    <ConstructorMember type={property}/>
  ), { joiner: "\n" });
}



