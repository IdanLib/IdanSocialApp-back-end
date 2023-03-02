import express from "express";
import { verifyToken } from "../middleware/authMidware.js";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
  delComment,
  addComment,
} from "../controllers/postsCtrl.js";

const router = express.Router();

//READ
//home endpoint
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

//UPDATE
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, delComment);
router.patch("/:id/addcomment", verifyToken, addComment);

//DELETE
router.delete("/:id/delete", verifyToken, deletePost);

export default router;
