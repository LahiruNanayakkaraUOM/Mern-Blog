import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BarLoader, PulseLoader, ScaleLoader } from "react-spinners";

const Posts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setFetched(false);
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts(data.posts);
        setLoading(false);
        setFetched(true);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setFetched(true);
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchPosts();
    } else {
      setFetched(true);
    }
  }, [currentUser._id]);

  return (
    <div
      className="table-auto md:mx-auto overflow-x-scroll scrollbar
     scrollbar-track-slate-100 scrollbar-thumb-slate-300
     dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500"
    >
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <div className="p-6">
          <Table hoverable className="shadow-md">
            <TableHead>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {userPosts.map((post) => (
                <TableRow
                  key={post}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover rounded bg-gray-500"
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="font-medium text-gray-800 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <span className="text-red-500 hover:text-red-400 font-medium cursor-pointer">
                      Delete
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="text-teal-500 hover:text-teal-400 font-medium cursor-pointer"
                      to={`/update-post/${post.slug}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          {loading && <PulseLoader size={12} color="#23B6C7" />}
          {fetched && <h2 className="text-2xl">You have no posts to show!</h2>}
        </div>
      )}
    </div>
  );
};

export default Posts;
