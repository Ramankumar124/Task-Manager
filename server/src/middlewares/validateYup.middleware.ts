import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "yup";
import { ApiError } from "../utils/ApiError";
 

const validateYup = (schema: ObjectSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validate(req.body, {
        abortEarly: false, 
        stripUnknown: true,
      });
      next();
    } catch (err: any) {
      return next(new ApiError(400, err.errors.join(", ")));
    }
  };
};

export default validateYup;
