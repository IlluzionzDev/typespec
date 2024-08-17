import { Model } from "@typespec/compiler";
import * as jv from "@alloy-js/java";
import { ModelDeclaration } from "./model-declaration.js";

export interface ModelSourceFileProps{
  type: Model;
}
/**
 * We will need a component like this as I believe we will need a source file for each model in the
 * tsp file. This also fixes the issues with nesting components in the emitter which causes the
 * indentation issue.*/
export function ModelSourceFile({ type }: ModelSourceFileProps) {
  const pathName = type.name + ".java";
  return<jv.SourceFile path={pathName}><ModelDeclaration type={type}></ModelDeclaration>
  </jv.SourceFile>
}
