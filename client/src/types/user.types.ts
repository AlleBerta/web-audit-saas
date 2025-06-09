// Per i dati inseriti dall'utente nel Signup
export interface SignupFormData {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Per i dati ricevuti dal backend (es: GET /users/:id)
export interface UserResponse {
  id: number;
  email: string;
  name: string;
  surname: string;
  role: 'admin' | 'user';
}

export interface LoginFormData {
  email: string;
  password: string;
}

// Per eventuali liste di utenti (es: GET /users)
export type UserListItem = Omit<UserResponse, 'createdAt' | 'updatedAt'>;
