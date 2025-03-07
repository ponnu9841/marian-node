import { User } from "@prisma/client";
import * as Joi from "joi";
import { UserInput } from "../interfaces/user";

export function validateUser(user: UserInput) {
  const JoiSchema = Joi.object({
    username: Joi.string().min(5).max(30).required(),
    email: Joi.string().email().min(5).max(50).optional(),
    password: Joi.date().optional(),

  }).options({ abortEarly: false });

  return JoiSchema.validate(user);
}
