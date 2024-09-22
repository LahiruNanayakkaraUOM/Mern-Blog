import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  if (req.body.userId !== req.user.id) {
    return next(errorHandler(403, "You are not allowed to comment"));
  }
  try {
    const { rate, content, postId, userId } = req.body;
    const newComment = new Comment({
      rate,
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({
      ...(postId && { postId }),
    }).sort({
      createdAt: -1,
    });
    const noOfComments = await Comment.countDocuments({
      postId,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
