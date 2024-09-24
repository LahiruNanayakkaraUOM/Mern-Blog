import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import CommentSection from "./CommentSection";
import PostCard from "../components/PostCard";

const SinglePost = () => {
  const { postSlug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentPosts, setRecentPosts] = useState(null);

  const fetchPost = async (postSlug) => {
    setLoading(true);
    if (!postSlug) {
      return;
    }

    try {
      const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
      const data = await res.json();
      if (res.ok) {
        setLoading(false);
        setPost(data.posts[0]);
      } else {
        setLoading(false);
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPost(postSlug);
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch("/api/post/getPosts?limit=3");
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        } else {
          console.log(data.error);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecentPosts();
  }, []);

  return loading ? (
    <div className="flex justify-center items-center min-h-screen">
      {loading && <PulseLoader size={12} color="#23B6C7" />}
    </div>
  ) : (
    <div className="w-full min-h-screen ">
      <div className="mx-auto max-w-3xl p-4 my-10 flex flex-col items-center">
        <h1 className="text-3xl lg:text-5xl font-bold text-center capitalize max-w-2xl">
          {post && post.title}
        </h1>
        <Link
          className="mt-10"
          to={`/search?category=${post && post.category}`}
        >
          <Button color={"gray"} pill size={"xs"}>
            {post && post.category}
          </Button>
        </Link>
        <img
          className="mt-10 p-3 max-h-[600px] w-full object-cover"
          src={post && post.image}
          alt={post && post.title}
        />
        <div className="mt-4 w-full flex justify-between border-b border-slate-500 p-3 text-xs">
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="italic">
            {post && (post.content.length / 100).toFixed(0)} mins read
          </span>
        </div>
        <div
          className="p-3 w-full post-content mb-10"
          dangerouslySetInnerHTML={{ __html: post && post.content }}
        ></div>
        <CommentSection postId={post && post._id} />
      </div>
      <div className="flex flex-col justify-center items-center my-10 w-full">
          <h1 className="text-xl font-medium">Recent Articles</h1>
          <div className="flex flex-wrap justify-center gap-5 mt-10 w-full">
            {recentPosts &&
              recentPosts.map((post) => {
                return <PostCard key={post._id} post={post} />;
              })}
          </div>
        </div>
    </div>
  );
};

export default SinglePost;
