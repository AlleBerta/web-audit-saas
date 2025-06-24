export type AccessTokenPayload = {
  id: number;
  email: string;
  name: string;
  surname: string;
  role: string;
};

export type RefreshTokenPayload = {
  sessionId: number;
  userId: number;
};
