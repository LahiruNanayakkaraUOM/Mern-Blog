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
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setFetched(false);
      const res = await fetch(`/api/user/getusers`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        setLoading(false);
        setFetched(true);
        if (data.totalUsers <= 9) {
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
      fetchUsers();
    } else {
      setFetched(true);
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      setLoading(true);
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/user/delete/${userIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
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
      {currentUser.isAdmin && users.length > 0 ? (
        <div className="p-6">
          <Table hoverable className="shadow-md">
            <TableHead>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {users.map((user) => (
                <TableRow
                  key={user._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 object-cover rounded-full bg-gray-500"
                    />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <Badge className="justify-center" color={"success"}>
                        Admin
                      </Badge>
                    ) : (
                      <Badge className="justify-center" color={"gray"}>
                        User
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className="text-red-500 hover:text-red-400 font-medium cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
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
          {fetched && <h2 className="text-2xl">You have no users to show!</h2>}
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
              <Button onClick={handleDeleteUser} color={"failure"}>
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
