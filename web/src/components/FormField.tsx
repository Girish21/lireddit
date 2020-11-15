import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/core";
import { useField } from "formik";
import * as React from "react";

type FormFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
};

export const FormField: React.FC<FormFieldProps> = function ({
  name,
  label,
  placeholder,
  type,
  ...props
}) {
  const [field, meta] = useField({ name, ...props });
  const error = meta.error && meta.touched ? meta.error : "";

  return (
    <FormControl isInvalid={Boolean(error)}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        {...field}
        id={name}
        placeholder={placeholder}
        autoComplete="off"
        type={type}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};
