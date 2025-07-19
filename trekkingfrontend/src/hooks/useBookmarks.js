import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkStatus, setBookmarkStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const checkedPackages = useRef(new Set());

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

        // Update bookmark status from bookmarks data
        const statusMap = {};
        data.bookmarks.forEach((bookmark) => {
          statusMap[bookmark.package.id] = true;
        });
        setBookmarkStatus((prev) => ({ ...prev, ...statusMap }));
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

  // Check bookmark status for a package with caching
  const checkBookmarkStatus = useCallback(
    async (packageId) => {
      if (!user) return false;

      // Check if we already have status for this package
      if (packageId in bookmarkStatus) {
        return bookmarkStatus[packageId];
      }

      // Check if we already requested this package
      if (checkedPackages.current.has(packageId)) {
        return false;
      }

      checkedPackages.current.add(packageId);

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

      checkedPackages.current.delete(packageId);
      return false;
    },
    [user, bookmarkStatus]
  );

  // Check multiple bookmark statuses at once
  const checkMultipleBookmarkStatus = useCallback(
    async (packageIds) => {
      if (!user || !packageIds.length) return;

      // Filter out packages we already have status for
      const uncheckedIds = packageIds.filter(
        (id) => !(id in bookmarkStatus) && !checkedPackages.current.has(id)
      );

      if (uncheckedIds.length === 0) return;

      // Mark as being checked
      uncheckedIds.forEach((id) => checkedPackages.current.add(id));

      try {
        const promises = uncheckedIds.map(async (packageId) => {
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
            return { packageId, bookmarked: data.bookmarked };
          }
          return { packageId, bookmarked: false };
        });

        const results = await Promise.all(promises);

        const statusUpdates = {};
        results.forEach(({ packageId, bookmarked }) => {
          statusUpdates[packageId] = bookmarked;
        });

        setBookmarkStatus((prev) => ({ ...prev, ...statusUpdates }));
      } catch (error) {
        console.error("Error checking multiple bookmark statuses:", error);
      } finally {
        // Remove from checking set
        uncheckedIds.forEach((id) => checkedPackages.current.delete(id));
      }
    },
    [user, bookmarkStatus]
  );

  // Initialize bookmarks on user login
  useEffect(() => {
    if (user) {
      fetchBookmarks();
      checkedPackages.current.clear();
    } else {
      setBookmarks([]);
      setBookmarkStatus({});
      checkedPackages.current.clear();
    }
  }, [user, fetchBookmarks]);

  return {
    bookmarks,
    bookmarkStatus,
    loading,
    toggleBookmark,
    checkBookmarkStatus,
    checkMultipleBookmarkStatus,
    fetchBookmarks,
  };
};
