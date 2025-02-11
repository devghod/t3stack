import * as yup from 'yup';

export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Required email')
    .email('Invalid email'),
  password: yup
    .string()
    .required('Required password')
});

export const RegistrationSchema = yup.object().shape({
  email: yup
    .string()
    .required('Required email')
    .email('Invalid email'),
  role: yup
    .string()
    .required('Required role'),
  timezone: yup
    .string()
    .required('Required time zone'),
  password: yup
    .string()
    .min(6, 'Minimum of 6 characters required')
    .required('Required password'),
  repeatPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Required password'),
  name: yup
    .string()
    .required('Required name')
});
