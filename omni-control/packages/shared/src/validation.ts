import Joi from "joi";

export const withValidation = <T>(schema: Joi.ObjectSchema<T>, payload: unknown): T => {
  const { value, error } = schema.validate(payload, { abortEarly: false, stripUnknown: true });
  if (error) {
    throw new Error(`Validierungsfehler: ${error.message}`);
  }
  return value;
};
