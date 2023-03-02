import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";

//CREATE
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newPost = new PostModel({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    await newPost.save();

    const postList = await PostModel.find();
    return res.status(201).json(postList);
  } catch (error) {
    console.error(error);
    return res.status(409).json({ message: error.message });
  }
};

//READ
export const getFeedPosts = async (req, res) => {
  try {
    const postList = await PostModel.find();
    return res.status(200).json(postList);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const userPostList = await PostModel.find({ userId });
    return res.status(200).json(userPostList);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: error.message });
  }
};

// UPDATE;
export const likePost = async (req, res) => {
  const { id } = req.params;
  const likedPost = await PostModel.findById(id);

  const { userId } = req.body;

  //User can both like and unlike - respond accordingly
  const hasLiked = likedPost.likes.get(userId);

  hasLiked ? likedPost.likes.delete(userId) : likedPost.likes.set(userId, true);

  //save to db
  const updatedPost = await PostModel.findByIdAndUpdate(
    id,
    { likes: likedPost.likes },
    { new: true } //return new post
  );

  return res.status(201).json(updatedPost);
};

export const delComment = async (req, res) => {
  // find post that whose comments need updating
  const { id } = req.params;
  const relevantPostToUpdate = await PostModel.findById(id);

  const { indexToDel } = req.body;

  const newCommentsArr = relevantPostToUpdate.comments
    .slice(0, indexToDel)
    .concat(relevantPostToUpdate.comments.slice(indexToDel + 1));

  const updatedPost = await PostModel.findByIdAndUpdate(
    id,
    { comments: newCommentsArr },
    { new: true }
  );

  return res.status(201).json(updatedPost);
};

export const addComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const updatedPost = await PostModel.findByIdAndUpdate(
    id,
    { $push: { comments: content } },
    { new: true }
  );

  return res.status(201).json(updatedPost);
};

//DELETE
export const deletePost = async (req, res) => {
  const { id } = req.params;

  //delete post on db
  await PostModel.deleteOne({ _id: id });

  const postList = await PostModel.find();
  return res.status(201).json(postList);
};
