import { Button } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import * as React from "react";
import { FormField } from "../components/FormField";
import { Wrapper } from "../components/Wrapper";

interface RegisterProps {}

const register: React.FC<RegisterProps> = ({}) => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 1500))
        }}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off">
            <FormField
              label="Username"
              name="username"
              placeholder="Username"
            />
            <FormField
              label="Password"
              name="password"
              placeholder="Password"
              type="password"
            />
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default register;
