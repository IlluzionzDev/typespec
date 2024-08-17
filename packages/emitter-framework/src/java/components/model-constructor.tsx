import { ModelProperty } from "@typespec/compiler";
import { TypeExpression } from "./type-expression.js";
import { Constructor } from "@alloy-js/java";
import { mapJoin } from "@alloy-js/core";
import { ConstructorMember } from "./constructor-member.js";

export interface ModelConstructorProps{
  properties: ModelProperty[];
}

export function ModelConstructor(props : ModelConstructorProps) {
  const properties = props.properties;
  const params = createTypeRecord(properties);
  const members = constructorMembersMapJoin(properties);
  console.log('constructor members:', members);
  return<Constructor parameters={params} accessModifier={'public'}>{members}</Constructor>
}

function createTypeRecord(properties: ModelProperty[]): Record<string, string> {
  const result: Record<string, string> = {};
  console.log('Properties received by createTypeRecord:', properties);

  properties.forEach(property => {
    const expression = getTypeExpression(property);
    console.log('Type expression for property', property.name, ':', expression);
    result[property.name] = expression;
  });

  return result;
}

function getTypeExpression(property: ModelProperty) {
  return(
    <TypeExpression type={property.type}></TypeExpression>
  )
}

function constructorMembersMapJoin(properties: ModelProperty[]) {
  console.log('Properties received by constructorMembers:', properties);

  return mapJoin(Array.from(properties), (property) => (
    <ConstructorMember type={property}/>
  ), { joiner: "\n" });
}



