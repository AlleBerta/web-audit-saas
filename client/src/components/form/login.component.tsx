import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormik } from 'formik';
import { LoginFormData, UserResponse } from '@/types/user.types';
import validationSchema from '@/schemas/login.schema';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { ApiResponse } from '@/types/server_response.types';

const initialValues: LoginFormData = {
  email: '',
  password: '',
};

const LoginComponent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (values: LoginFormData) => {
    // Handle form submission logic here
    // like making an API call or updating the store
    try {
      // Aggiungo anche il campo 'tipo="user"' come default
      const response = await api.post<ApiResponse<UserResponse>>('/users/login', values);

      if (response.data.success) {
        toast({
          title: 'Login Successful',
          description: 'Welcome back to ImmuniWeb® Neuron',
        });
        navigate('/');
      }
      console.log(response.data);
    } catch (error: any) {
      if (error.response) {
        toast({
          title: 'Errore!',
          description: error.response.data.message || 'Qualcosa è andato storto',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Errore di connessione',
          description: 'Impossibile contattare il server. Riprova più tardi.',
          variant: 'destructive',
        });
      }
    }
  };

  const formik = useFormik<LoginFormData>({
    validationSchema,
    initialValues,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Sign In
      </Button>
    </form>
  );
};

export default LoginComponent;
