import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Modal,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const Posts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

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
        if (data.totalPosts <= 9) {
          setShowMore(false);
        }
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

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      setLoading(true);
      const res = await fetch(
        `/api/post/getposts?userId${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/delete/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

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
                  key={post._id}
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
                    <span
                      className="text-red-500 hover:text-red-400 font-medium cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                    >
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
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              {loading ? <Spinner size="sm" /> : <span>Show more</span>}
            </button>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          {loading && <PulseLoader size={12} color="#23B6C7" />}
          {fetched && <h2 className="text-2xl">You have no posts to show!</h2>}
        </div>
      )}
      <Modal
        show={showModal}
        className="bg-blend-darken"
        onClose={() => {
          setShowModal(false);
        }}
        popup
        size={"md"}
      >
        <Modal.Header />
        <Modal.Body clas>
          <div className="text-center">
            <HiOutlineExclamationCircle
              className="text-gray-400 dark:text-gray-200 mx-auto mb-2"
              size={50}
            />
            <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-2">
              <Button onClick={handleDeletePost} color={"failure"}>
                Yes, I&#39;m sure
              </Button>
              <Button
                onClick={() => {
                  setShowModal(false);
                }}
                color={""}
                outline
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Posts;
