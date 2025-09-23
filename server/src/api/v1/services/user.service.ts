import { User } from '../models/UserModel';
import { ApiError, constants } from '../utils';

/**
 * @description Get user from id
 * @access private
 */
export const getUser = async (id: number): Promise<User> => {
  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      // include: [Project],
    });
    if (!user) {
      throw new ApiError(constants.NOT_FOUND, 'Utente non trovato');
    }
    return user;
  } catch (err) {
    throw new ApiError(constants.BAD_REQUEST, 'Errore interno');
  }
};
