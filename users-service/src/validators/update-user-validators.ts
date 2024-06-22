import { body } from "express-validator";

export const updateUserValidationRules = [
  body("username")
    .optional()
    .isLength({ min: 4, max: 20 })
    .withMessage("Username must be between 4 and 20 characters"),
];
