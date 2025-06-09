import * as Yup from 'yup';

const ValidationSchema = Yup.object({
  name: Yup.string().required('Campo obbligatorio'),
  surname: Yup.string().required('Campo obbligatorio'),
  email: Yup.string().email('Email non valida').required('Campo obbligatorio'),
  password: Yup.string().min(6, 'Minimo 6 caratteri').required('Campo obbligatorio'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Le password non coincidono')
    .required('Campo obbligatorio'),
});

export default ValidationSchema;
