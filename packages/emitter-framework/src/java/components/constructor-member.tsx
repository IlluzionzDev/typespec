import { ModelProperty, Type } from "@typespec/compiler";


export interface ConstructorMemberProps {
  type: ModelProperty;
}

export function ConstructorMember({type} : ConstructorMemberProps) {
  console.log('this.'+ type.name + '=' + type.name)
  return(
<>this.{type.name} = {type.name};
</>
  )
}
