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

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    const index = comment.likes.indexOf(req.user.id);
    if (index === -1) {
      comment.noOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.noOfLikes -= 1;
      comment.likes.splice(index, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};
