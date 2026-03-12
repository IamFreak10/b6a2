import { Request, Response } from 'express';
import { userService } from './user.service';
import { JwtPayload } from 'jsonwebtoken';

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getUsers();
    return res.status(200).json({
      success: true,
      message: 'user fetched successfully',
      data: result,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const updateUserInfo = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const loggedInUser = req.user as JwtPayload;

    // req.body কে সরাসরি পরিবর্তন না করে একটি ক্লোন তৈরি করা নিরাপদ
    const updateData = { ...req.body };

    /**
     * রুল ১: যদি ইউজার এডমিন না হয় এবং সে নিজের প্রোফাইল বাদে অন্য কারো আইডি দিয়ে ট্রাই করে,
     * তবে তাকে পারমিশন দেওয়া হবে না।
     */
    if (
      loggedInUser.role !== 'admin' &&
      String(loggedInUser.id) !== String(userId)
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this profile',
      });
    }

    /**
     * রুল ২: যদি ইউজার এডমিন না হয়, তবে সে চাইলেও 'role' ফিল্ড আপডেট করতে পারবে না।
     * আমরা বডি থেকে 'role' কি-টি ডিলিট করে দিচ্ছি।
     */
    if (loggedInUser.role !== 'admin') {
      delete updateData.role;
    }

    // সার্ভিস কল করা
    const result = await userService.updateUser(userId as string, updateData);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: result,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message || 'Something went wrong',
    });
  }
};


const deleteUser=async(req:Request,res:Response)=>{
  try {
    const {userId}=req.params;
    const result=await userService.deleteUser(userId as string);
    return res.status(200).json({
      success:true,
      message:"User deleted successfully",
      data:result
    })
  } catch (e:any) {
    return res.status(500).json({
      success:false,
      message:e.message
    })
  }
}

export const userController = {
  getUsers,
  updateUserInfo,
  deleteUser
};
