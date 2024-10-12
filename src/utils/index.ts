/* eslint-disable @typescript-eslint/no-explicit-any */

import { rEmail } from "../constants";

// Define common types for validation
type ValidationResult = {
  isValid: boolean;
  message?: string;
};

type ValidatorFunction = (value: any, values?: Record<string, any>) => boolean | ValidationResult;

type SanitizerFunction = (value: any) => any;

type ValidationError = {
  type: string;
  message: string;
  ref: string;
};

// Validator class
export class Validator {
  private errors: ValidationError[] = [];
  private validations: { validate: ValidatorFunction; message: string; ref: string; type: string }[] = [];
  private sanitizers: SanitizerFunction[] = [];
  private dependency: string[] = [];

  addValidation(validationFn: ValidatorFunction, message: string, ref: any, type: string = 'INVALID_ERROR'): this {
    if (ref?.dependency) {
      this.dependency = ref?.dependency;
    }
    this.validations.push({ validate: validationFn, message, ref, type });
    return this;
  }

  addSanitizer(sanitizeFn: SanitizerFunction): this {
    this.sanitizers.push(sanitizeFn);
    return this;
  }

  runValidations(value: any, values: Record<string, any> = {}): { isValid: boolean; sanitizedValue: any } {
    this.errors = [];

    // Apply sanitizers first
    this.sanitizers.forEach((sanitize) => {
      value = sanitize(value); // Apply sanitization (trimming, etc.)
    });

    // Run validations on the sanitized value
    this.validations.forEach((validation) => {
      const validationResult = validation.validate(value, values);
      if (typeof validationResult === 'boolean' && !validationResult) {
        this.errors.push({ type: validation.type, message: validation.message, ref: validation.ref });
      } else if (typeof validationResult === 'object' && !validationResult.isValid) {
        this.errors.push({ type: validation.type, message: validationResult.message || validation.message, ref: validation.ref });
      }
    });

    return { isValid: this.errors.length === 0, sanitizedValue: value };
  }

  getErrors(): ValidationError[] {
    return this.errors;
  }

  // Static method to create boolean validator
  static boolean(ref?:any): Validator {
    const validator = new Validator();
    validator.addValidation(
      (value) => typeof value === 'boolean',
      'Value must be a boolean',
      ref
    );
    return validator;
  }



  // Static method to create driving license validator
  static drivingLicense(ref?: any): Validator {
    const validator = new Validator();
    validator.addValidation(
      (value) => /^[A-Z]{2}\d{2}[A-Z]\d{7}$/.test(value), // Format may vary by state
      'Value must be a valid Indian driving license number',
      ref
    );
    return validator;
  }

  // Static method to create voter card validator
  static indianVoterCard(ref?: any): Validator {
    const validator = new Validator();
    validator.addValidation(
      (value) => /^[A-Z]{3}\d{7}$/.test(value),
      'Value must be a valid Indian voter ID number',
      ref
    );
    return validator;
  }

  // Static method to create passport number validator
  static indianPassport(ref?: any): Validator {
    const validator = new Validator();
    validator.addValidation(
      (value) => /^[A-Z]{1}[0-9]{7}$/.test(value),
      'Value must be a valid Indian passport number',
      ref
    );
    return validator;
  }



  // Static method to create Aadhaar card validator
  static indianAadhaarCard(ref?: any): Validator {
    const validator = new Validator();
    validator.addValidation(
      (value) => /^\d{12}$/.test(value),
      'Value must be a valid 12-digit Aadhaar number',
      ref
    );
    return validator;
  }

   // Static method to create email validator
   static email(ref?: any): Validator {
    const validator = new Validator();
    validator.addValidation(
      (value) => rEmail.test(value),
      'Value must be a valid email address',
      ref
    );
    return validator;
  }
     // Static method to create Indian PAN card validator
  static indianPanCard(ref?: any): Validator {
    const validator = new Validator();
    validator.addValidation(
      (value) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value),
      'Value must be a valid Indian PAN card',
      ref
    );
    return validator;
  }

    // Static method to create Indian bank account number validator
    static indianBankAccountNumber(ref?: any): Validator {
      const validator = new Validator();
      validator.addValidation(
        (value) => /^\d{9,18}$/.test(value),
        'Value must be a valid Indian bank account number (9 to 18 digits)',
        ref
      );
      return validator;
    }
    // Static method to create IFSC code validator
    static indianIFSCCode(ref?: any): Validator {
      const validator = new Validator();
      validator.addValidation(
        (value) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value),
        'Value must be a valid IFSC code',
        ref
      );
      return validator;
    }
   // Static method to create date validator
   static dateValid(ref?: any): Validator {
    const validator = new Validator();
    validator.addValidation(
      (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      'Value must be a valid date',
      ref
    );
    return validator;
  }


  // Static method to create string validator
  static string(ref?: any): Validator {
    const validator = new Validator();
    validator.addValidation(
      (value) => typeof value === 'string',
      'Value must be a string',
      ref
    );
    return validator;
  }

  // Static method to create number validator
  static number(ref?: AnalyserOptions): Validator {
    const validator = new Validator();
    validator.addValidation(
      (value) => !isNaN(Number(value)),
      'Value must be a number',
      ref
    );
    return validator;
  }

  // Required field validator
  required(ref: string = ''): this {
    this.addValidation(
      (value) => value !== undefined && value !== null && value !== '',
      'Mandatory field!',
      ref,
      'REQUIRED_ERROR'
    );
    return this;
  }

  // Minimum value validator
  min(minValue: number, ref: string = ''): this {
    this.addValidation(
      (value) => value >= minValue,
      `Value must be at least ${minValue}`,
      ref,
      'MIN_LENGTH_ERROR'
    );
    return this;
  }

  // Maximum value validator
  max(maxValue: number, ref: string = ''): this {
    this.addValidation(
      (value) => value <= maxValue,
      `Value must not exceed ${maxValue}`,
      ref,
      'MAX_LENGTH_ERROR'
    );
    return this;
  }

  // Minimum length validator
  minLength(minValue: number, ref: string = ''): this {
    this.addValidation(
      (value) => value.length >= minValue,
      `Value must be at least ${minValue} characters long`,
      ref,
      'MIN_LENGTH_ERROR'
    );
    return this;
  }

  // Maximum length validator
  maxLength(maxValue: number, ref: string = ''): this {
    this.addValidation(
      (value) => value.length <= maxValue,
      `Value must not exceed ${maxValue} characters long`,
      ref,
      'MAX_LENGTH_ERROR'
    );
    return this;
  }

  // Trim method to remove leading/trailing spaces
  trim(replaceInternalSpaces: boolean = false): this {
    this.addSanitizer((value: string) => {
      if (typeof value === 'string') {
        let trimmedValue = value.trim();
        if (replaceInternalSpaces) {
          trimmedValue = trimmedValue.replace(/\s+/g, ''); // Replace all internal spaces
        }
        return trimmedValue;
      }
      return value;
    });
    return this;
  }

  // Type cast to number
  castToNumber(): this {
    this.addSanitizer((value: any) => {
      const numberValue = Number(value);
      return isNaN(numberValue) ? value : numberValue;
    });
    return this;
  }

  // Test method for custom validations
  test(fn: ValidatorFunction, message: string, ref: string = '', type: string = 'INVALID_ERROR'): this {
    this.addValidation(fn, message, ref, type);
    return this;
  }
}

// Schema class to handle object or array validation
export class Schema {
  private fields: Record<string, Validator | any>;

  constructor(fields: Record<string, Validator | any>) {
    this.fields = fields;
  }

  async validate(values: Record<string, any>): Promise<Record<string, any>> {
    const errors: Record<string, any> = {};
    const sanitizedValues: Record<string, any> = {};

    for (const key in this.fields) {
      const validator = this.fields[key];

      // Handle arrays of objects
      if (Array.isArray(values[key]) && validator.isArray) {
        const arrayErrors: Record<string, any>[] = [];
        const arraySanitized: Record<string, any>[] = [];

        for (let i = 0; i < values[key].length; i++) {
          const item = values[key][i];
          try {
            const validatedItem = await validator.schema.validate(item);
            arraySanitized.push(validatedItem);
          } catch (itemErrors:any) {
            arrayErrors[i] = itemErrors;
          }
        }

        if (arrayErrors.length > 0) {
          errors[key] = arrayErrors;
        } else {
          sanitizedValues[key] = arraySanitized;
        }
      } else {
        // Handle regular fields
        const result = validator.runValidations(values[key], values);
        if (!result.isValid) {
          errors[key] = validator.getErrors();
        } else {
          sanitizedValues[key] = result.sanitizedValue;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return Promise.reject(errors);
    }

    return Promise.resolve(sanitizedValues);
  }

  static arrayOf(schema: Schema): any {
    return { isArray: true, schema };
  }
}

// ValidationService class to use Schema
export class ValidationService {
  private schema: Schema;

  constructor(schema: Schema) {
    this.schema = schema;
  }

  async validate(values: Record<string, any>): Promise<Record<string, any>> {
    return this.schema.validate(values);
  }
}

// Function to create schema from an object
export function createSchemaFromObject(data: any, name?: string): Schema {
  if (Array.isArray(data) && name) {
    return new Schema({ [name]: Schema.arrayOf(createSchemaFromSingleObject(data[0])) });
  } else {
    return createSchemaFromSingleObject(data);
  }
}

// Helper function to create schema from a single object
export function createSchemaFromSingleObject(data: Record<string, any>): Schema {
  const schemaFields: Record<string, any> = {};

  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (Array.isArray(value)) {
      schemaFields[key] = createSchemaFromObject(value, key);
    } else {
      schemaFields[key] = value;
    }
  });

  return new Schema(schemaFields);
}

// Safe string utility function
export function safeString(value: any): string {
  if (
    value === null ||
    value === undefined ||
    Array.isArray(value) ||
    typeof value === 'object' ||
    (isNaN(value) && typeof value !== 'string')
  ) {
    return '';
  }

  return String(value);
}
