import { Router } from 'express';
import {
  getUsers,
  getUser,
  registerUser,
  loginUsers,
  modifyUserInfo,
  modifyUserPsw,
  deleteUser,
} from '../controllers/UserController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUsers);
// Da qua in poi aggiungere il validate token
router.get('/current/:id', getUser);
router.put('/modifyInfo/', modifyUserInfo);
router.put('/modifypsw/', modifyUserPsw);
router.delete('/', deleteUser);

export default router;
