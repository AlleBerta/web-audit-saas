import { Router } from 'express';
import {
  getUsers,
  registerUser,
  loginUsers,
  modifyUserInfo,
  modifyUserPsw,
  deleteUser,
  getUserInfo,
} from '../controllers/UserController';
import deserializeUser from '../middlewares/deserializeUser';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUsers);
// router.get('/', getUsers);
// Routes protette
// Tutte le route dopo questa riga avranno accesso a req.user
router.use(deserializeUser);
router.get('/current/:id', getUserInfo);
router.put('/modifyInfo/', modifyUserInfo);
router.put('/modifypsw/', modifyUserPsw);
router.delete('/', deleteUser);

export default router;
