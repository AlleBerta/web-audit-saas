import { Session } from '../models/SessionModel';

// src/services/session.service.ts
export const invalidateSessionById = async (sessionId: number) => {
  return await Session.update({ expiresAt: new Date(0) }, { where: { id: sessionId } });
};
