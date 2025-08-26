import { Router } from "express";
import { getAllUsers, userLogin, userLogout, userSignup, verifyUser } from "../controllers/user-controllers.js";
import { loginValidator, signupValidator, validate } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";

const userRoutes = Router();
// Add this for testing purposes
userRoutes.get("/test-cors", (req, res) => {
  console.log("'/test-cors' route was hit successfully.");
  return res.status(200).json({ message: "CORS test successful!" });
});
userRoutes.get("/",getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth-status",verifyToken, verifyUser);
userRoutes.get("/logout",verifyToken,userLogout);
export default userRoutes;