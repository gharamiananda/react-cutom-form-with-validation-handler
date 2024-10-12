/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { constants, utils } from "../hooks/getReactCustomFormValidationHandler";

const {Validator,safeString}= utils;
const {rEmail}= constants;

export const schema={ 
  userName:  Validator.string().required().minLength(3).maxLength(8),
  aggrredTerms: Validator.boolean({dependency:['mobile']}),
  age: Validator.number(),

  email: Validator.string().required().test(
    (value: string, values: Record<string, any> | undefined) => {
     return  !!safeString( value).match(rEmail) },
    'Invalid email address'
  ),
  mobile : Validator.number().test(
    (value: string, values: Record<string, any> | undefined) => {

if(values?.aggrredTerms===true){
return  value?.length===6;
}
return true;
},
    'Invalid mobile number'
  ),
};