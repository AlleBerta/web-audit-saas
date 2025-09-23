import * as Yup from 'yup';

const ValidationSchema = Yup.object({
  email: Yup.string().email('Email non valida').required('Campo obbligatorio'),
  password: Yup.string().min(6, 'Minimo 6 caratteri').required('Campo obbligatorio'),
});

export default ValidationSchema;
