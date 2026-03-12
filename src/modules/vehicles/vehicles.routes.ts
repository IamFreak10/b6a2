import express from 'express';
import { vehiclesController } from './vehicles.controller';
import auth from '../../middlewares/auth';

const router = express.Router();
router.post('/', auth('admin'), vehiclesController.createVehicle);
router.get('/', vehiclesController.getVehicles);
router.get('/:id', vehiclesController.getVehicle);
router.put('/:id', auth('admin'), vehiclesController.updateVehicle);
router.delete('/:id', auth('admin'), vehiclesController.deletVehicle);
export const vehiclesRoutes = router;
