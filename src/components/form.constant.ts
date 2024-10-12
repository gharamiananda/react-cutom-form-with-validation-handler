/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */


import getReactCustomFormValidationHandler from '../hooks/getReactCustomFormValidationHandler';
const { utilitiesMethods } = getReactCustomFormValidationHandler();

export const schema={ 
  userName: utilitiesMethods .Validator.string().required().minLength(3).maxLength(8),
  aggrredTerms: utilitiesMethods.Validator.boolean({dependency:['mobile']}),

  email: utilitiesMethods.Validator.string().required().test(
    (value: string, values: Record<string, any> | undefined) => {
     return  !!utilitiesMethods.safeString( value).match(utilitiesMethods.rEmail) },
    'Invalid email address'
  ),
  mobile : utilitiesMethods.Validator.number().test(
    (value: string, values: Record<string, any> | undefined) => {

if(values?.aggrredTerms===true){
return  value?.length===6;
}
return true;
},
    'Invalid mobile number'
  ),
};