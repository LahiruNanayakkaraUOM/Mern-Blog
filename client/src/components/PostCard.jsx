import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="group relative w-full sm:w-[430px] border hover:bg-teal-100 dark:hover:bg-teal-950 dark:border-teal-500 h-[360px] overflow-hidden rounded-lg">
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt={post.title}
          className="h-[260px] w-full object-cover group-hover:h-[200px]
          transition-all duration-300 z-20"
        />
      </Link>
      <div className="flex flex-col gap-2 p-3">
        <p className="font-semibold text-lg line-clamp-2">{post.title}</p>
        <span className="text-sm italic">{post.category}</span>
        <Link to={`/post/${post.slug}`} className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0
        border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white
        transition-all duration-200 text-center py-2 rounded-md !rounded-tl-none m-2">Read more</Link>
      </div>
    </div>
  );
};

export default PostCard;
