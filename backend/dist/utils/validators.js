import { body, validationResult } from "express-validator";
const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const errors = await validation.run(req);
            if (!errors.isEmpty()) {
                break;
            }
        }
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        return res.status(422).json({ errors: errors.array() });
    };
};
const loginValidator = [
    //body("name").notEmpty().withMessage("Name is required."), not needed
    body("email").trim().isEmail().withMessage("Email is required."),
    body("password").trim().isLength({ min: 6 }).withMessage("Password should contain atleast 6 chars."),
];
const signupValidator = [
    body("name").notEmpty().withMessage("Name is required."),
    //body("email").trim().isEmail().withMessage("Email is required."),
    //body("password").trim().isLength({min:6}).withMessage("Password should contain atleast 6 chars."),
    ...loginValidator,
];
const chatCompletionValidator = [
    body("message").notEmpty().withMessage("Message is required."),
];
export { validate, signupValidator, loginValidator, chatCompletionValidator };
//# sourceMappingURL=validators.js.map