import { body } from "express-validator";

export const updateUserValidationRules = [
  body("email").optional().isEmail().withMessage("Email must be valid"),
  body("password")
    .optional()
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
];
