import { Button, Rating, RatingStar, Spinner, Textarea } from "flowbite-react";
import { useEffect, useState } from "react";
import moment from "moment";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

const CommentCard = ({ commentVal, onLike, onEdit }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedContent, setEditedContent] = useState(commentVal.content);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/user/getuser/${commentVal.userId}`);
      const data = await res.json();
      if (res.ok) {
        setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [commentVal]);

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/comment/editComment/${commentVal._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editedContent }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSaving(false);
        setIsEditable(false);
        onEdit(commentVal, editedContent);
      } else {
        console.log(data.message);
        setIsSaving(false);
      }
    } catch (error) {
      setIsSaving(false);
      console.log(error);
    }
  };

  return (
    <div className="flex gap-2 p-3 shadow-sm">
      <div className="">
        <img
          className="w-8 h-8 rounded-full"
          src={user && user.profilePicture}
          alt={user && user.username}
        />
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold truncate">
            @{user ? user.username : "Anonymouse user"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {moment(commentVal.createdAt).fromNow()}
          </span>
        </div>
        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 gap-2">
          <Rating>
            <RatingStar
              className="hover:cursor-pointer"
              filled={commentVal.rate >= 1 ? true : false}
            />
            <RatingStar
              className="hover:cursor-pointer"
              filled={commentVal.rate >= 2 ? true : false}
            />
            <RatingStar
              className="hover:cursor-pointer"
              filled={commentVal.rate >= 3 ? true : false}
            />
            <RatingStar
              className="hover:cursor-pointer"
              filled={commentVal.rate >= 4 ? true : false}
            />
            <RatingStar
              className="hover:cursor-pointer"
              filled={commentVal.rate == 5 ? true : false}
            />
          </Rating>
        </div>

        {isEditable ? (
          <div className="flex flex-col items-end gap-2">
            <Textarea
              rows={3}
              defaultValue={editedContent}
              onChange={(e) => {
                setEditedContent(e.target.value);
              }}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleSubmit}
                gradientDuoTone={"purpleToBlue"}
                size={"sm"}
              >
                {isSaving ? <Spinner size={"sm"} /> : "Save"}
              </Button>
              <Button
                onClick={() => {
                  setIsEditable(!isEditable);
                }}
                gradientDuoTone={"purpleToBlue"}
                size={"sm"}
                outline
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-200">
              {commentVal.content}
            </p>
            <div className="flex items-center mt-2 pt-2 border-t dark:border-gray-700 max-w-fit gap-2">
              <button
                type="button"
                className={`text-gray-400 hover:text-blue-500 ${
                  currentUser &&
                  commentVal &&
                  commentVal.likes &&
                  commentVal.likes.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
                onClick={() => {
                  onLike(commentVal._id);
                }}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <span className="text-xs text-gray-500 dark:text-gray-300">
                {commentVal.noOfLikes > 0 && commentVal.noOfLikes + " Likes"}
              </span>
              {((currentUser && currentUser._id === commentVal.userId) ||
                currentUser.isAdmin) && (
                <span
                  onClick={() => {
                    setIsEditable(!isEditable);
                  }}
                  className="text-xs hover:text-blue-500 cursor-pointer"
                >
                  Edit
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
