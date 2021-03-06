import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: "Query";
  hello: Scalars["String"];
  posts: Array<Post>;
  post?: Maybe<Post>;
  me?: Maybe<User>;
};

export type QueryPostArgs = {
  id: Scalars["Int"];
};

export type Post = {
  __typename?: "Post";
  id: Scalars["Int"];
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
  title: Scalars["String"];
};

export type User = {
  __typename?: "User";
  id: Scalars["Int"];
  createdAt: Scalars["String"];
  updatedAt: Scalars["String"];
  username: Scalars["String"];
  email: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  createPost: Post;
  updatePost?: Maybe<Post>;
  deletePost: Scalars["Boolean"];
  register: UserResponse;
  login?: Maybe<UserResponse>;
  logout: Scalars["Boolean"];
  forgotPassword: Scalars["Boolean"];
  changePassword: UserResponse;
};

export type MutationCreatePostArgs = {
  title: Scalars["String"];
};

export type MutationUpdatePostArgs = {
  id: Scalars["Float"];
  title: Scalars["String"];
};

export type MutationDeletePostArgs = {
  id: Scalars["Float"];
};

export type MutationRegisterArgs = {
  credentials: RegisterInput;
};

export type MutationLoginArgs = {
  credentials: LoginInput;
};

export type MutationForgotPasswordArgs = {
  email: Scalars["String"];
};

export type MutationChangePasswordArgs = {
  password: Scalars["String"];
  token: Scalars["String"];
};

export type UserResponse = {
  __typename?: "UserResponse";
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type FieldError = {
  __typename?: "FieldError";
  field?: Maybe<Scalars["String"]>;
  message: Scalars["String"];
};

export type RegisterInput = {
  username: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
};

export type LoginInput = {
  username: Scalars["String"];
  password: Scalars["String"];
};

export type FieldErrorsFragment = { __typename?: "FieldError" } & Pick<
  FieldError,
  "field" | "message"
>;

export type RegularUserResponseFragment = { __typename?: "UserResponse" } & {
  errors?: Maybe<Array<{ __typename?: "FieldError" } & FieldErrorsFragment>>;
  user?: Maybe<{ __typename?: "User" } & UserDataFragment>;
};

export type UserDataFragment = { __typename?: "User" } & Pick<
  User,
  "id" | "username"
>;

export type ChangePasswordMutationVariables = Exact<{
  password: Scalars["String"];
  token: Scalars["String"];
}>;

export type ChangePasswordMutation = { __typename?: "Mutation" } & {
  changePassword: { __typename?: "UserResponse" } & RegularUserResponseFragment;
};

export type LoginMutationVariables = Exact<{
  username: Scalars["String"];
  password: Scalars["String"];
}>;

export type LoginMutation = { __typename?: "Mutation" } & {
  login?: Maybe<{ __typename?: "UserResponse" } & RegularUserResponseFragment>;
};

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation" } & Pick<
  Mutation,
  "logout"
>;

export type RegisterMutationVariables = Exact<{
  username: Scalars["String"];
  password: Scalars["String"];
  email: Scalars["String"];
}>;

export type RegisterMutation = { __typename?: "Mutation" } & {
  register: { __typename?: "UserResponse" } & RegularUserResponseFragment;
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: "Query" } & {
  me?: Maybe<{ __typename?: "User" } & UserDataFragment>;
};

export type PostsQueryVariables = Exact<{ [key: string]: never }>;

export type PostsQuery = { __typename?: "Query" } & {
  posts: Array<
    { __typename?: "Post" } & Pick<Post, "id" | "createdAt" | "title">
  >;
};

export const FieldErrorsFragmentDoc = gql`
  fragment FieldErrors on FieldError {
    field
    message
  }
`;
export const UserDataFragmentDoc = gql`
  fragment UserData on User {
    id
    username
  }
`;
export const RegularUserResponseFragmentDoc = gql`
  fragment RegularUserResponse on UserResponse {
    errors {
      ...FieldErrors
    }
    user {
      ...UserData
    }
  }
  ${FieldErrorsFragmentDoc}
  ${UserDataFragmentDoc}
`;
export const ChangePasswordDocument = gql`
  mutation ChangePassword($password: String!, $token: String!) {
    changePassword(password: $password, token: $token) {
      ...RegularUserResponse
    }
  }
  ${RegularUserResponseFragmentDoc}
`;

export function useChangePasswordMutation() {
  return Urql.useMutation<
    ChangePasswordMutation,
    ChangePasswordMutationVariables
  >(ChangePasswordDocument);
}
export const LoginDocument = gql`
  mutation Login($username: String!, $password: String!) {
    login(credentials: { username: $username, password: $password }) {
      ...RegularUserResponse
    }
  }
  ${RegularUserResponseFragmentDoc}
`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
}
export const LogoutDocument = gql`
  mutation Logout {
    logout
  }
`;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(
    LogoutDocument
  );
}
export const RegisterDocument = gql`
  mutation Register($username: String!, $password: String!, $email: String!) {
    register(
      credentials: { username: $username, password: $password, email: $email }
    ) {
      ...RegularUserResponse
    }
  }
  ${RegularUserResponseFragmentDoc}
`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument
  );
}
export const MeDocument = gql`
  query Me {
    me {
      ...UserData
    }
  }
  ${UserDataFragmentDoc}
`;

export function useMeQuery(
  options: Omit<Urql.UseQueryArgs<MeQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
}
export const PostsDocument = gql`
  query Posts {
    posts {
      id
      createdAt
      title
    }
  }
`;

export function usePostsQuery(
  options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<PostsQuery>({ query: PostsDocument, ...options });
}
