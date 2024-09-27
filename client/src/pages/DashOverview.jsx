import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiOutlineUserGroup,
  HiArrowNarrowUp,
  HiDocument,
  HiChat,
} from "react-icons/hi";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Link } from "react-router-dom";

const DashOverview = () => {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setFetched(false);
      const res = await fetch(`/api/user/getusers`);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        setTotalUsers(data.totalUsers);
        setLastMonthUsers(data.lastMonthUsers);
        setLoading(false);
        setFetched(true);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setFetched(true);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setFetched(false);
      const res = await fetch(`/api/post/getPosts?limit=5`);
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
        setLastMonthPosts(data.lastMonthPosts);
        setLoading(false);
        setFetched(true);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setFetched(true);
    }
  };

  const fetchComments = async () => {
    try {
      setLoading(true);
      setFetched(false);
      const res = await fetch(`/api/comment/getComments`);
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
        setTotalComments(data.totalComments);
        setLastMonthComments(data.lastMonthComments);
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
    fetchUsers();
    fetchPosts();
    fetchComments();
  }, [currentUser]);
  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-80 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup
              className="bg-teal-600
            text-white rounded-full text-5xl p-3 shadow-lg"
            />
          </div>
          <div className="flex gap-2 text-sm">
            <div className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </div>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-80 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiDocument
              className="bg-indigo-600
            text-white rounded-full text-5xl p-3 shadow-lg"
            />
          </div>
          <div className="flex gap-2 text-sm">
            <div className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </div>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-80 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 text-md uppercase">
                Total Comments
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <HiChat
              className="bg-lime-600
            text-white rounded-full text-5xl p-3 shadow-lg"
            />
          </div>
          <div className="flex gap-2 text-sm">
            <div className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </div>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
      </div>
      <div className="md:p-4 mx-auto  w-full md:max-w-5xl flex flex-col">
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 py-7">
          <div className="flex-1 flex flex-col gap-2 rounded-md w-full md:w-auto  md:max-w-[400px]">
            <div className="flex items-center justify-between">
              <span className="text-lg">Recent users</span>
              <Button gradientDuoTone={"purpleToPink"} outline>
                <Link to={"/dashboard?tab=users"}>See all</Link>
              </Button>
            </div>
            <Table>
              <TableHead>
                <TableHeadCell>Image</TableHeadCell>
                <TableHeadCell>Username</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {users &&
                  users.map((user) => {
                    return (
                      <TableRow
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        key={user._id}
                      >
                        <TableCell>
                          <img
                            className="w-10 h-10 rounded-full"
                            src={user.profilePicture}
                            alt={user.username}
                          />
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
          <div className="flex-1 flex flex-col gap-2  rounded-md w-full md:w-auto">
            <div className="flex items-center justify-between">
              <span className="text-lg">Recent Comments</span>
              <Button gradientDuoTone={"purpleToPink"} outline>
                <Link to={"/dashboard?tab=comments"}>See all</Link>
              </Button>
            </div>
            <Table>
              <TableHead>
                <TableHeadCell>Comment content</TableHeadCell>
                <TableHeadCell>Likes</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {comments &&
                  comments.map((comment) => {
                    return (
                      <TableRow
                        className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        key={comment._id}
                      >
                        <TableCell>{comment.content}</TableCell>
                        <TableCell>{comment.noOfLikes}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2 rounded-md w-full mx-auto">
          <div className="flex items-center justify-between">
            <span className="text-lg">Recent Posts</span>
            <Button gradientDuoTone={"purpleToPink"} outline>
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <Table>
            <TableHead>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {posts &&
                posts.map((post) => {
                  return (
                    <TableRow
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                      key={post._id}
                    >
                      <TableCell>
                        <img
                          className="w-10 h-10 rounded-lg"
                          src={post.image}
                          alt={post.title}
                        />
                      </TableCell>
                      <TableCell>{post.title}</TableCell>
                      <TableCell>{post.category}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashOverview;
