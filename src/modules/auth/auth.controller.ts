import { Request, Response } from 'express';
import { authService } from './auth.service';

const signUp = async (req: Request, res: Response) => {
  try {
    const result = await authService.signUp(req.body);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User Cannot created',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'User registraed successfully',
      data: result,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const signIn = async (req: Request, res: Response) => {
  
  try {
    const result = await authService.signIn(req.body.email, req.body.password);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User Not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Login successfully',
      data: result,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

export const authController = {
  signUp,
  signIn,
};
