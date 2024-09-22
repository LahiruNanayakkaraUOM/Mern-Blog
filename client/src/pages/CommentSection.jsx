import {
  Alert,
  Button,
  Rating,
  RatingStar,
  Spinner,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CommentCard from "../components/CommentCard";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [characterCount, setCharacterCount] = useState(200);
  const [rate, setRate] = useState(0);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [commentsRes, setCommentsRes] = useState([]);
  const navigate = useNavigate();

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comment/getcomments/${postId}`);
      const data = await res.json();
      if (res.ok) {
        setCommentsRes(data);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    if (rate === 0) {
      setSubmitting(false);
      return setFormError("Please rate this post");
    }
    if (!comment) {
      setSubmitting(false);
      return setFormError("Please add your comment");
    }
    try {
      const commentData = {
        rate,
        content: comment,
        postId,
        userId: currentUser._id,
      };

      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });
      const data = await res.json();

      if (res.ok) {
        setCommentsRes([commentData, ...commentsRes]);
        setSubmitting(false);
        setFormError(null);
        setComment("");

        setRate(0);
      } else if (!res.ok) {
        setSubmitting(false);
        setFormError(data.message);
      }
    } catch (error) {
      setSubmitting(false);
      setFormError(error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });
      if (res.ok) {
        const data = await res.json();
        setCommentsRes(
          commentsRes.map((com) => {
            if (com._id === commentId) {
              return {
                ...com,
                likes: data.likes,
                noOfLikes: data.noOfLikes,
              };
            } else {
              return com;
            }
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setCommentsRes(
      commentsRes.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  return (
    <div className="max-w-3xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-2 text-gray-500 my-5 text-sm">
          <p>Signed in as </p>
          <img
            className="w-10 h-10 rounded-full"
            src={currentUser.profilePicture}
            alt={currentUser.username}
          />
          <Link
            className="text-cyan-500 hover:underline"
            to={"/dashboard?tab=profile"}
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm my-5 text-gray-500">
          You must be signed in to comment.
          <Link className="text-cyan-500 hover:underline" to={"/sign-in"}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-5"
        >
          <div className="flex flex-col gap-2 mb-5">
            <p>Rate this post</p>
            <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 gap-2">
              <Rating>
                <RatingStar
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setRate(1);
                  }}
                  filled={rate >= 1 ? true : false}
                />
                <RatingStar
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setRate(2);
                  }}
                  filled={rate >= 2 ? true : false}
                />
                <RatingStar
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setRate(3);
                  }}
                  filled={rate >= 3 ? true : false}
                />
                <RatingStar
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setRate(4);
                  }}
                  filled={rate >= 4 ? true : false}
                />
                <RatingStar
                  className="hover:cursor-pointer"
                  onClick={() => {
                    setRate(5);
                  }}
                  filled={rate == 5 ? true : false}
                />
              </Rating>
              {rate > 0 && <p>{rate} out of 5</p>}
            </div>
          </div>
          <Textarea
            placeholder="Add a comment..."
            rows={5}
            maxLength={200}
            onChange={(e) => {
              setComment(e.target.value);
              setCharacterCount(200 - e.target.value.length);
            }}
            value={comment}
          />
          {formError && (
            <Alert className="mt-5" color={"failure"}>
              {formError}
            </Alert>
          )}
          <div className="flex items-center justify-between mt-5">
            <p className="text-gray-500 text-sm">
              {characterCount} characters remaining
            </p>
            <Button type="submit" gradientDuoTone={"purpleToBlue"} outline>
              {submitting ? <Spinner size={"sm"} /> : "Submit"}
            </Button>
          </div>
        </form>
      )}
      <div className="max-w-3xl mx-auto w-full p-3">
        <div className="flex items-center gap-2 my-3">
          <span>Comments</span>
          <div className="flex border w-8 h-8 item-center justify-center rounded-sm">
            <span style={{ lineHeight: 1.75 }}>
              {commentsRes && commentsRes.length}
            </span>
          </div>
        </div>
        <div className="my-3">
          {commentsRes &&
            commentsRes.map((comVal) => {
              return (
                <CommentCard
                  commentVal={comVal}
                  key={comVal._id || Math.random()}
                  onLike={handleLike}
                  onEdit={handleEdit}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
