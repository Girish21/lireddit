import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import * as React from "react";
import { UserForm } from "../components/UserForm";
import { Wrapper } from "../components/Wrapper";
import { useRegisterMutation } from "../generated/graphql";
import { errorMap } from "../utils/errorMap";

interface RegisterProps {}

const register: React.FC<RegisterProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register(values);
          if (response.data?.register.errors) {
            setErrors(errorMap(response.data?.register.errors));
          } else if (response.data?.register.user?.id) {
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
