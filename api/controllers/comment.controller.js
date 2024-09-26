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

export const getPostComments = async (req, res, next) => {
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

export const getComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to get comments"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const comments = await Comment.find()
      .skip(startIndex)
      .limit(limit)
      .sort({ updatedAt: sortDirection });

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    const totalComments = await Comment.countDocuments();
    res.status(200).json({
      comments,
      totalComments,
      lastMonthComments,
    });
  } catch (error) {}
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

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to edit this comment")
      );
    }
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true }
    );
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }
    if (!req.user.isAdmin && req.user.id !== comment.userId) {
      return next(
        errorHandler(403, "You are not allowed to delete this comment")
      );
    }
    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json("Comment deleted successfully");
  } catch (error) {
    next(error);
  }
};
