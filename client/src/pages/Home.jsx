import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import { Spinner } from "flowbite-react";

export default function Home() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/post/getposts");
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div className="">
      <div className="flex flex-col md:flex-row items-center justify-center px-28 py-20 max-w-5xl mx-auto">
        <div className="flex flex-col gap-8">
          <h1 className="text-4xl lg:text-6xl font-bold">Welcome to My Blog</h1>
          <p className="md:max-w-md md:text-[18px]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <Link
            className="text-sm text-teal-500 font-bold hover:underline"
            to={"/search"}
          >
            View All posts
          </Link>
        </div>
        <div className="p-10">
          <img className="w-80 md:w-80" src="..\src\assets\Hero.png" alt="" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-10 p-3 py-10 mx-auto bg-teal-200 dark:bg-slate-800 bg-opacity-50">
        <h1 className="text-4xl font-medium">Recent Articles</h1>
        <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-center">
          {loading && <Spinner size={"sm"} />}
          {!loading &&
            posts &&
            posts.map((post) => {
              return <PostCard key={post._id} post={post} />;
            })}
        </div>
        <Link to={"/search"} className="text-lg text-teal-500 hover:underline">
          View All Posts
        </Link>
      </div>
    </div>
  );
}
