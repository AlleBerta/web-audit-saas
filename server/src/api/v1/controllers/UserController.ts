import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import config from '@config/config';
import { createSession } from './SessionController';
import { sendResponse, ApiError, constants } from '../utils/';
import { User } from '../models/UserModel';
import { Project } from '../models/ProjectModel';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

// GET
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [Project],
    });

    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Operazione completata con successo',
      data: users,
    });
  } catch (err) {
    next(err); // Lascia che sia l'error handler globale a gestirlo
  }
};

/**
 * @description Get user from email
 * @access public
 */
export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body;
    const user = await User.findOne({
      where: { email: email },
      attributes: { exclude: ['password'] },
      include: [Project],
    });

    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Operazione completata con successo',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Register new user
 * @route POST /users/register
 * @access Public
 */
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, surname, password } = req.body;

    if (!email || !name || !surname || !password) {
      throw new ApiError(constants.BAD_REQUEST, 'Tutti i campi sono obbligatori.');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError(constants.CONFLICT, 'Email già registrata.');
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.PSW_SALT));

    // Per
    const newUser = await User.create({
      email,
      name,
      surname,
      password: hashedPassword,
    });

    sendResponse(res, {
      statusCode: constants.RESOURCE_CREATED,
      success: true,
      message: 'Utente creato con successo.',
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        surname: newUser.surname,
        role: newUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Login user
 * @route POST /user/login
 * @access Public
 */
export const loginUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(constants.BAD_REQUEST, 'Tutti i campi sono obbligatori.');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
      throw new ApiError(constants.UNAUTHORIZED, 'Email o password non valida');
    }

    // Creo la sessione
    const userPayload = await createSession(existingUser, res);

    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Utente loggato con successo',
      data: userPayload,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @description Get user info
 * @route GET /user/current/
 * @access private
 */
export const getUserInfo = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.user?.id;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [Project],
    });

    if (!user) throw new ApiError(constants.NOT_FOUND, 'User not found');
    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Operazione completata con successo',
      data: {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        surname: user?.surname,
        role: user?.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Modify user info
 * @route PUT /user/modifyInfo/
 * @access Private
 */
export const modifyUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, surname } = req.body;
    // Attualmente id è vuoto, crea prima l'access token, poi ricavi l'id da lì
    const id = req.params.id;

    if (!name || !surname) {
      throw new ApiError(constants.BAD_REQUEST, 'Tutti i campi sono obbligatori.');
    }

    const existingUser = await User.findOne({ where: { id } });
    if (!existingUser) {
      throw new ApiError(constants.CONFLICT, "L'utente non esiste.");
    }

    const [updatedUser] = await User.update(
      {
        name: name,
        surname: surname,
      },
      {
        where: { id: id },
      }
    );
    if (updatedUser === 0) {
      throw new ApiError(constants.NOT_FOUND, 'Post non trovato o nessuna modifica necessaria');
    }

    sendResponse(res, {
      statusCode: constants.RESOURCE_CREATED,
      success: true,
      message: 'Utente modificato con successo.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Modify user password
 * @route PUT /users/modifyPass/
 * @access Private
 */
export const modifyUserPsw = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Attualmente id è vuoto, crea prima l'access token, poi ricavi l'id da lì
    if (!req.user) {
      throw new ApiError(constants.UNAUTHORIZED, 'Utente non autenticato');
    }
    const id = req.user?.id;
    const { oldPsw, newPsw } = req.body;

    if (!oldPsw || !newPsw) {
      throw new ApiError(constants.BAD_REQUEST, 'Tutti i campi sono obbligatori.');
    }

    // Controllo se lo user è presente nel db
    const existingUser = await User.findOne({ where: { id } });
    if (!existingUser) {
      throw new ApiError(constants.CONFLICT, "L'utente non esiste.");
    }

    const match = await bcrypt.compare(oldPsw, existingUser.password);
    if (!match) throw new ApiError(constants.UNAUTHORIZED, 'Vecchia password sbagliata');

    const hashedNewPassword = await bcrypt.hash(newPsw, Number(process.env.PSW_SALT));
    await User.update({ password: hashedNewPassword }, { where: { id: existingUser.id } });

    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Utente modificato con successo.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc Delete user profile
 * @route DELETE /users/
 * @access Private
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  // id che ricavo dal validate token
  const { id } = req.body;

  try {
    const deleted = await User.destroy({
      where: { id: id },
    });
    // Elimino anche il token
    if (deleted === 0) throw new ApiError(constants.NOT_FOUND, 'User not found');

    sendResponse(res, {
      statusCode: constants.OK,
      success: true,
      message: 'Usere deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};
