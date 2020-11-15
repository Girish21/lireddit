import { FieldError } from "../generated/graphql";

export function errorMap(errors: FieldError[]) {
  return errors.reduce((errors, error): Record<string, string> => {
    if (error.field)
      return {
        ...errors,
        [error.field]: error.message,
      };
    return errors;
  }, {});
}
