const { check, body } = require("express-validator");

export const loginValidator = [check("email").isEmail()];

export const registerValidator = [
  check("email").isEmail(),
  check("password").isLength({ min: 5 }),
  check("name")
    .not()
    .isEmpty(),
  body("password2").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  })
];

export const bookingValidation = [
  check("date")
    .not()
    .isEmpty(),
  check("time")
    .not()
    .isEmpty()
];
