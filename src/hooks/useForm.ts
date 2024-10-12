
import { useEffect, useRef, useState } from 'react';

import { createSchemaFromObject, safeString, Schema, ValidationService } from "../utils";

// Define types for form values, options, and validation schema
interface ValidationSchema {
  [key: string]: any;
}

interface FormOptions {
  validationSchema?: ValidationSchema;
}

interface UseFormProps {
  initialValues: Record<string, any>;
  onSubmitCallback: (values: Record<string, any>) => void;
  options?: FormOptions;
}

interface HandleChangeOptions {
  UPPERCASE?: boolean;
  CUSTOMVALUE?: string;
  MULTISPACEALLOW?: boolean;
  MAXLENGTH?: number;
  LOWERCASE?: boolean;
  NOSPACEALLOW?: boolean;
  REPLACEREGEX?: RegExp;
  NOSPACIALCHARATERALLOW?: boolean;
  ONLYNUMBERALLOW?: boolean;
}

function useForm({ initialValues = {}, onSubmitCallback = () => {}, options = {} }: UseFormProps) {
  const [render, setRender] = useState<number | null>(null);
  const formRef = useRef<Record<string, HTMLInputElement | null>>({});
  const valuesRef = useRef<Record<string, any>>(initialValues);
  const touchedRef = useRef<Record<string, boolean>>({});
  const errorRef = useRef<Record<string, any>>({});
  const focusValuesRef = useRef<Record<string, any>>(initialValues);

  useEffect(() => {
    if (formRef.current) {
      Object.keys(initialValues).forEach((key) => {
        if (formRef.current[key]) {
          if (formRef.current[key].type === "checkbox") {
            formRef.current[key].checked = initialValues[key];
          } else {
            formRef.current[key].value = initialValues[key];
          }
        }
      });
    }
  }, []);

  let validationSchema: Schema | null = null;

  if (options?.validationSchema) {
    validationSchema = createSchemaFromObject(options?.validationSchema);
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    focusValuesRef.current[name] = formRef.current[name]?.value;
  };

  const handleSingleFieldError = async (name: string, value: any) => {
    const singleFieldValidationSchema = Array.isArray(options?.validationSchema)
      ? options?.validationSchema[0][name]
      : options?.validationSchema?.[name];

    if (singleFieldValidationSchema) {
      const updatedValue = { ...valuesRef.current, [name]: value };

      if (singleFieldValidationSchema?.dependency?.length > 0) {
        await singleFieldValidationSchema?.dependency.forEach(async (element: string) => {
          const dependencySchema = Array.isArray(options?.validationSchema)
            ? options?.validationSchema[0][element]
            : options?.validationSchema?.[element];

          if (dependencySchema) {
            const personSchema = new Schema({
              [element]: dependencySchema,
            });

            const validationService = new ValidationService(personSchema);
            try {
              await validationService.validate(updatedValue);
              errorRef.current[element] = null;
            } catch (errors:any) {
              errorRef.current[element] = errors?.[element];
            } finally {
              setRender(Math.random());
            }
          }
        });
      }

      const personSchema = new Schema({
        [name]: singleFieldValidationSchema,
      });

      const validationService = new ValidationService(personSchema);
      try {
        const sanitizedValues = await validationService.validate(updatedValue);
        errorRef.current[name] = null;
        return { value: sanitizedValues };
      } catch (errors:any) {
        errorRef.current[name] = errors?.[name];
        return { error: errors?.[name] };
      }
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    options: HandleChangeOptions = {}
  ) => {
    const { name, value, type } = e.target;
    let processedValue:any = value.trim().replace(/\s+/g, " ");
  
    // Check if a custom value is provided
    if (options.CUSTOMVALUE) {
      processedValue = options.CUSTOMVALUE;
    } else {
      // Type check for HTMLInputElement with type 'checkbox'
      if (type === "checkbox" && (e.target as HTMLInputElement).checked !== undefined) {
        processedValue = (e.target as HTMLInputElement).checked;
        if (formRef.current[name]) {
          formRef.current[name].checked = processedValue; // Use non-null assertion after the check
          console.log('processedValue', formRef.current[name].checked)


          valuesRef.current[name] = processedValue;
        }  
      }
    

      if (type === "text") {
        if (options.MULTISPACEALLOW) {
          processedValue = value;
        }
        if (options.UPPERCASE) {
          processedValue = safeString(processedValue).toUpperCase();
        }
        if (options.LOWERCASE) {
          processedValue = safeString(processedValue).toLowerCase();
        }
        if (options.MAXLENGTH && options.MAXLENGTH > 0) {
          processedValue = processedValue.slice(0, options.MAXLENGTH);
        }
        if (options.NOSPACEALLOW) {
          processedValue = processedValue.replace(/\s+/g, "");
        }
        if (options.REPLACEREGEX) {
          processedValue = processedValue.replace(options.REPLACEREGEX, "");
        }
        if (options.NOSPACIALCHARATERALLOW) {
          processedValue = processedValue.replace(/[^a-zA-Z0-9 ]/g, "");
        }
        if (options.ONLYNUMBERALLOW) {
          processedValue = processedValue.replace(/[^0-9]/g, "");
        }
        if (formRef.current[name]) {

          formRef.current[name].value = processedValue; // Use non-null assertion after the check
          valuesRef.current[name] = processedValue;
        }  
      }
    }
  

    if (validationSchema) {
      const prevError = errorRef.current[name]?.[0];
      const newError = await handleSingleFieldError(name, processedValue);

      if (prevError?.type === newError?.error?.[0]?.type) {
        return;
      }

      if (touchedRef.current[name]) {
        setRender(Math.random());
      }
    }
  };

  const handleBlur = async (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;

    if (validationSchema) {
      const isPrevSuccess = !errorRef.current[name]?.length;
      const prevError = errorRef.current[name]?.[0];
      const newError = await handleSingleFieldError(name, formRef.current[name]?.value);

      if (isPrevSuccess && !newError?.error?.length) {
        touchedRef.current[name] = true;
        return;
      }

      if (touchedRef.current[name] === true && prevError?.type === newError?.error?.[0]?.type) {
        touchedRef.current[name] = true;
        return;
      }

      touchedRef.current[name] = true;
      setRender(Math.random());
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validationSchema) {
      const validationService = new ValidationService(validationSchema);
      try {
        const sanitizedValues = await validationService.validate(valuesRef.current);
        onSubmitCallback(sanitizedValues);
      } catch (errors:any) {
        errorRef.current = errors;
        if (Object.keys(errors).length > 0) {
          return;
        }
      } finally {
        setRender(Math.random());
      }
    }

    onSubmitCallback(valuesRef.current);
    setRender(Math.random());
  };

  return {
    touchedRef,
    handleChange,
    handleBlur,
    handleSubmit,
    errorRef,
    render,
    setRender,
    onFocus,
    formRef,
    valuesRef,
  };
}

export default useForm;
