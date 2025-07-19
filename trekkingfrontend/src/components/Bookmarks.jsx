import { BookmarkIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBookmarks } from "../hooks/useBookmarks";

const Bookmarks = () => {
  const { user } = useAuth();
  const { bookmarks, loading, fetchBookmarks, toggleBookmark } = useBookmarks();

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Please log in to view your bookmarks
          </h2>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Your Bookmarked Packages
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Keep track of your favorite trekking adventures
          </p>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <BookmarkIcon className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              No bookmarks yet
            </h3>
            <p className="text-gray-500 mb-8">
              Start exploring our packages and bookmark your favorites!
            </p>
            <Link
              to="/packages"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Browse Packages
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-64">
                  <img
                    src={
                      bookmark.package.images?.[0]?.image ||
                      "/images/default-trek.jpg"
                    }
                    alt={bookmark.package.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => toggleBookmark(bookmark.package.id)}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <BookmarkIcon className="h-5 w-5 fill-current" />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {bookmark.package.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {bookmark.package.description}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <div className="text-2xl font-bold text-blue-600">
                      ${bookmark.package.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      {bookmark.package.duration} days
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link
                      to={`/packages/${bookmark.package.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 text-center py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/booking?package=${bookmark.package.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
