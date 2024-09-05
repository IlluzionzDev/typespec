import { Children, mapJoin } from "@alloy-js/core";
import { Constructor, ConstructorProps } from "@alloy-js/java";
import { Model } from "@typespec/compiler";
import { ConstructorMember } from "./constructor-member.js";
import { TypeExpression } from "./type-expression.js";

export interface ModelConstructorProps extends ConstructorProps {
  type: Model;
}

/**
 * Constructor to instantiate a model through its constructor. Will initialise model members
 * TODO: Handle super constructor
 */
export function ModelConstructor(props: ModelConstructorProps) {
  const properties = Array.from(props.type.properties.values());

  const parameters: Record<string, Children> = {};
  properties.forEach((property) => {
    parameters[property.name] = <TypeExpression type={property} />;
  });

  return (
    <Constructor public parameters={parameters}>
      {mapJoin(
        properties,
        (property) => (
          <ConstructorMember type={property} />
        ),
        { joiner: "\n" }
      )}
      {props.children}
    </Constructor>
  );
}
