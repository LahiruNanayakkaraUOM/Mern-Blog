import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Modal,
  Badge,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const Users = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setFetched(false);
      const res = await fetch(`/api/comment/getcomments`);
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
        setLoading(false);
        setFetched(true);
        if (data.totalComments <= 9) {
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
      fetchComments();
    } else {
      setFetched(true);
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      setLoading(true);
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
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
      {currentUser.isAdmin && comments.length > 0 ? (
        <div className="p-6">
          <Table hoverable className="shadow-md">
            <TableHead>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>Comment</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
              <Table.HeadCell>Post Id</Table.HeadCell>
              <Table.HeadCell>User Id</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {comments.map((comment) => (
                <TableRow
                  key={comment._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{comment.content}</TableCell>
                  <TableCell>{comment.noOfLikes}</TableCell>
                  <TableCell>{comment.postId}</TableCell>
                  <TableCell>{comment.userId}</TableCell>
                  <TableCell>
                    <span
                      className="text-red-500 hover:text-red-400 font-medium cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                    >
                      Delete
                    </span>
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
          {fetched && (
            <h2 className="text-2xl">You have no comments to show!</h2>
          )}
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
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle
              className="text-gray-400 dark:text-gray-200 mx-auto mb-2"
              size={50}
            />
            <h3 className="text-lg text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete this user?
            </h3>
            <div className="flex justify-center gap-2">
              <Button onClick={handleDeleteComment} color={"failure"}>
                Yes, I&#39;m sure
              </Button>
              <Button
                onClick={() => {
                  setShowModal(false);
                }}
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

export default Users;
