import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Il nome del progetto è obbligatorio')
    .min(2, 'Il nome deve essere di almeno 2 caratteri')
    .max(50, 'Il nome non può superare i 50 caratteri'),
  domain: Yup.string(),
});

export default validationSchema;
