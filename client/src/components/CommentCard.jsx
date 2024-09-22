import { Rating, RatingStar } from "flowbite-react";
import { useEffect, useState } from "react";
import moment from "moment";

const CommentCard = ({ comment }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/user/getuser/${comment.userId}`);
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
  }, [comment]);
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
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <div className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 gap-2">
          <Rating>
            <RatingStar
              className="hover:cursor-pointer"
              filled={comment.rate >= 1 ? true : false}
            />
            <RatingStar
              className="hover:cursor-pointer"
              filled={comment.rate >= 2 ? true : false}
            />
            <RatingStar
              className="hover:cursor-pointer"
              filled={comment.rate >= 3 ? true : false}
            />
            <RatingStar
              className="hover:cursor-pointer"
              filled={comment.rate >= 4 ? true : false}
            />
            <RatingStar
              className="hover:cursor-pointer"
              filled={comment.rate == 5 ? true : false}
            />
          </Rating>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-200">{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentCard;
