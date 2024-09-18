import * as jv from "@alloy-js/java"
import { Child, Refkey } from "@alloy-js/core";
import { springFramework } from "../libraries/index.js";


export interface AnnotationsProps {
  annotationKind: string;
  annotationParameters?: string;
}

export function SpringAnnotation({annotationKind, annotationParameters}: AnnotationsProps) {
  const kind = SpringAnnotations.get(annotationKind);
  if (annotationParameters) {
    const valueRecord: Record<string, Child> = {"" : annotationParameters};
    return <jv.Annotation type={kind} value={valueRecord}></jv.Annotation>
  }
  return <jv.Annotation type={kind}></jv.Annotation>
}


export const SpringAnnotations = new Map<string, Refkey>([
  ["get", springFramework.GetMapping],
  ["put", springFramework.PutMapping],
  ["delete", springFramework.DeleteMapping],
  ["post", springFramework.PostMapping],
  ["patch", springFramework.PatchMapping],
  ["body", springFramework.RequestBody],
  ["path", springFramework.PathVariable],
  ["header", springFramework.RequestHeader],
  ["query", springFramework.RequestParam],
])

