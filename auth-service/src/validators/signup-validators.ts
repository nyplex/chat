import { body } from "express-validator";

export const signupValidationRules = [
  body("email").isEmail().withMessage("Email must be valid"),
  body("confirmEmail").custom((value, { req }) => {
    if (value !== req.body.email) {
      throw new Error("Emails must match");
    }
    return true;
  }),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords must match");
    }
    return true;
  }),
];