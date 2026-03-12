import { Request, Response } from 'express';
import { vehiclesService } from './vehicles.services';

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.createVehicle(req.body);
    if (!result) {
      return res.status(401).json({
        sucess: false,
        message: 'Can not create  vehicle',
      });
    }
    return res.status(201).json({
      success: true,
      message: 'vehicle successfully',
      data: result,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.getVehicles();
    if (!result) {
      return res.status(401).json({
        sucess: false,
        message: 'Can not Find  vehicle',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'vehicle got successfully',
      data: result,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
const getVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await vehiclesService.getVehicle(id as string);
    if (!result) {
      return res.status(401).json({
        sucess: false,
        message: 'Can not Find  vehicle',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'vehicle got successfully',
      data: result,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await vehiclesService.updateVehicle(id as string, req.body);
    if (!result) {
      return res.status(401).json({
        sucess: false,
        message: 'Can not Find  vehicle',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'vehicle updated successfully',
      data: result,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const deletVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await vehiclesService.deletVehicle(id as string);
    if (!result) {
      return res.status(401).json({
        sucess: false,
        message: 'Can not Find  vehicle',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'vehicle deleted successfully',
      data: result,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
export const vehiclesController = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deletVehicle,
};
