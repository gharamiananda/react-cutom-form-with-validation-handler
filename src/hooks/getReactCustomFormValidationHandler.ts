import { rEmail, rUrl, rUUID } from '../constants';
import { createSchemaFromObject, createSchemaFromSingleObject, safeString, Schema, ValidationService, Validator } from '../utils';
import useForm from './useForm';
const getReactCustomFormValidationHandler = () => {
const formMethods=useForm;


 const utilitiesMethods={
    safeString, Validator,
    rEmail,
    rUrl,
    rUUID,
    Schema,
    ValidationService,
    createSchemaFromObject,
    createSchemaFromSingleObject
  }
  

  return {
    utilitiesMethods,
    useReactCustomFormValidationHandler  :formMethods
    
  }
}

export default getReactCustomFormValidationHandler