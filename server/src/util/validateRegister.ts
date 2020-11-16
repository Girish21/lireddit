import { RegisterInput } from '../types/RegisterInput';

export const validateRegister = function ({
  username,
  password,
  email,
}: RegisterInput) {
  if (!username.length || username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'Please enter a username',
      },
    ];
  }
  if (!email.length || !email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'Please enter a valid email',
      },
    ];
  }
  if (!password.length) {
    return [
      {
        field: 'password',
        message: 'Please enter a password',
      },
    ];
  }
  return null;
};
