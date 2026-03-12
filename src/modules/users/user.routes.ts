import express from 'express';
import auth from '../../middlewares/auth';
import { userController } from './user.controller';

const router = express.Router();

router.get('/', auth('admin'), userController.getUsers);
router.put('/:userId', auth('admin'), userController.updateUserInfo);
router.delete('/:userId', auth('admin'), userController.deleteUser);

export const userRoutes = router;
