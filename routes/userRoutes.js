import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  updateSocial,
} from "../controllers/usersCtrl.js";
import { verifyToken } from "../middleware/authMidware.js";

const router = express.Router();

router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.patch("/:id/updatesocial", verifyToken, updateSocial);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
