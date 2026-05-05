// import express from "express";
// import {
//   registerUser,
//   loginUser,
//   getProfile,
//   updateProfile,
// } from "../controllers/userController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);
// router.get("/profile", protect, getProfile);
// router.put("/profile", protect, updateProfile);

// export default router;


import express from "express";
import {
  registerUser,
  loginUser,
  firebaseLogin,
  getProfile,
  updateProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/firebase-login", firebaseLogin);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
