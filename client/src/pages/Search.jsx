import { Button, Select, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "Uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  console.log(sidebarData);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort") || "desc";
    const categoryFromUrl = urlParams.get("category") || "Uncategorized";
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        const data = await res.json();
        if (res.ok) {
          setLoading(false);
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        } else {
          setLoading(false);
          console.log(data.message);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData((prev) => {
        return { ...prev, searchTerm: e.target.value };
      });
    }

    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData((prev) => {
        return { ...prev, sort: order };
      });
    }

    if (e.target.id === "category") {
      const category = e.target.value || "Uncategorized";
      setSidebarData((prev) => {
        return { ...prev, category };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const noOfPosts = posts.length;
    const startIndex = noOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      }
    }
  };

  useEffect(() => {
    if (posts.length === totalPosts) {
      setShowMore(false);
    }
  }, [handleShowMore]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Search Term</label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="sort">Sort</label>
            <Select onChange={handleChange} id="sort" value={sidebarData.sort}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="category">Category</label>
            <Select
              onChange={handleChange}
              id="category"
              value={sidebarData.category}
            >
              <option value="Uncategorized">Uncategorized</option>
              <option value="react">React</option>
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone={"purpleToPink"}>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <div className="sm:border-b border-gray-500 p-4">
          <h1 className="text-xl md:text-3xl font-semibold px-3">
            Search Results
          </h1>
        </div>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found</p>
          )}
          {loading && (
            <div className="w-full flex items-center justify-center">
              <Spinner className="my-20 md:my-48" />
            </div>
          )}
          {!loading &&
            posts &&
            posts.map((post) => {
              return <PostCard key={post._id} post={post} />;
            })}
          {showMore && (
            <div className="w-full flex justify-center">
              <button
                className="text-teal-500 text-lg hover:underline p-7"
                onClick={handleShowMore}
              >
                Show more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
