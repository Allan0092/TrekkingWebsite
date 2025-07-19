import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkStatus, setBookmarkStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getAuthToken = () => localStorage.getItem("authToken");

  // Fetch user's bookmarks
  const fetchBookmarks = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/bookmarks/", {
        headers: {
          Authorization: `Token ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks);
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Toggle bookmark for a package
  const toggleBookmark = useCallback(
    async (packageId, navigate = null) => {
      if (!user) {
        toast.info("Please log in to bookmark packages");
        if (navigate) navigate("/login");
        return false;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/packages/${packageId}/bookmark/`,
          {
            method: "POST",
            headers: {
              Authorization: `Token ${getAuthToken()}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Update bookmark status
          setBookmarkStatus((prev) => ({
            ...prev,
            [packageId]: data.bookmarked,
          }));

          // Show toast notification
          if (data.bookmarked) {
            toast.success("Package bookmarked!");
          } else {
            toast.success("Bookmark removed!");
          }

          // Refresh bookmarks list
          fetchBookmarks();

          return data.bookmarked;
        } else {
          toast.error("Failed to update bookmark");
          return false;
        }
      } catch (error) {
        console.error("Error toggling bookmark:", error);
        toast.error("Error updating bookmark");
        return false;
      }
    },
    [user, fetchBookmarks]
  );

  // Check bookmark status for a package
  const checkBookmarkStatus = useCallback(
    async (packageId) => {
      if (!user) return false;

      try {
        const response = await fetch(
          `http://localhost:8000/api/packages/${packageId}/bookmark/status/`,
          {
            headers: {
              Authorization: `Token ${getAuthToken()}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBookmarkStatus((prev) => ({
            ...prev,
            [packageId]: data.bookmarked,
          }));
          return data.bookmarked;
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
      return false;
    },
    [user]
  );

  // Initialize bookmarks on user login
  useEffect(() => {
    if (user) {
      fetchBookmarks();
    } else {
      setBookmarks([]);
      setBookmarkStatus({});
    }
  }, [user, fetchBookmarks]);

  return {
    bookmarks,
    bookmarkStatus,
    loading,
    toggleBookmark,
    checkBookmarkStatus,
    fetchBookmarks,
  };
};
