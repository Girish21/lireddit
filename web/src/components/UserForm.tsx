import { Button } from "@chakra-ui/core";
import { Form } from "formik";
import { FormField } from "./FormField";

type UserFormProps = {
  isSubmitting: boolean;
  register?: boolean;
};

export const UserForm: React.FC<UserFormProps> = function ({
  isSubmitting,
  register = false,
}) {
  return (
    <>
      <FormField label="Username" name="username" placeholder="Username" />
      {register && <FormField label="Email" name="email" placeholder="Email" />}
      <FormField
        label="Password"
        name="password"
        placeholder="Password"
        type="password"
      />
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </>
  );
};
