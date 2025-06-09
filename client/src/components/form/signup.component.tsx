import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormik } from 'formik';
import { SignupFormData, UserResponse } from '@/types/user.types';
import validationSchema from '@/schemas/signup.schema';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/axios';
import { ApiResponse } from '@/types/server_response.types';

const initialValues: SignupFormData = {
  name: '',
  surname: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const SignupComponent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (values: SignupFormData) => {
    // Handle form submission logic here
    // like making an API call or updating the store
    try {
      // Aggiungo anche il campo 'tipo="user"' come default
      const response = await api.post<ApiResponse<UserResponse>>('/users/register', values);

      if (!response.data.success) {
        toast({
          title: 'Incomplete Form',
          description: 'Please fill in all fields',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Account Created',
          description: 'Welcome to ImmuniWeb® Neuron! Please sign in.',
        });
        navigate('/login');
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

  const formik = useFormik<SignupFormData>({
    validationSchema,
    initialValues,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-red-500">{formik.errors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="surname">Surname</Label>
          <Input
            id="surname"
            name="surname"
            placeholder="Doe"
            value={formik.values.surname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
          />
          {formik.touched.surname && formik.errors.surname && (
            <p className="text-sm text-red-500">{formik.errors.surname}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john.doe@example.com"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-sm text-red-500">{formik.errors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-sm text-red-500">{formik.errors.password}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <p className="text-sm text-red-500">{formik.errors.confirmPassword}</p>
        )}
      </div>
      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Create Account
      </Button>
    </form>
  );
};

export default SignupComponent;
