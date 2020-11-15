import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import * as React from "react";
import { UserForm } from "../components/UserForm";
import { Wrapper } from "../components/Wrapper";
import { useLoginMutation } from "../generated/graphql";
import { errorMap } from "../utils/errorMap";

interface RegisterProps {}

const register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login?.errors) {
            setErrors(errorMap(response.data?.login?.errors));
          } else if (response.data?.login?.user?.id) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off">
            <UserForm isSubmitting={isSubmitting} />
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default register;
