import { Router } from "express";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

// All address routes should be protected by verifyToken
router.get("/", verifyToken, getAddresses);
router.post("/", verifyToken, addAddress);
router.delete("/:id", verifyToken, deleteAddress);
router.patch("/:id/default", verifyToken, setDefaultAddress);

export default router;
