import { Button, Text } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { NextPage, NextPageContext } from "next";
import { withUrqlClient, WithUrqlProps } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { FormField } from "../../components/FormField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { errorMap } from "../../utils/errorMap";

interface ChangePasswordProps {
  token: string;
}

const ChangePassword: NextPage<ChangePasswordProps, WithUrqlProps> = ({
  token,
}) => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({ ...values, token });
          if (response.data?.changePassword?.errors) {
            setErrors(errorMap(response.data?.changePassword?.errors));
          } else if (response.data?.changePassword?.user?.id) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting, errors }) => (
          <Form autoComplete="off">
            <FormField
              label="Password"
              name="password"
              placeholder="password"
              type="password"
            />
            {(errors as any).token && (
              <Text color="red" fontSize="1rem">
                {(errors as any).token}
              </Text>
            )}
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

ChangePassword.getInitialProps = async function ({ query }: NextPageContext) {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient, {
  ssr: false,
})(ChangePassword);
