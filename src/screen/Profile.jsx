import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X, Search as SearchIcon } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

const NavBar = ({ user, onAdd }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b p-4 flex items-center justify-between">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
          N
        </div>
        <span className="text-lg font-semibold">Notes</span>
      </div>

    
    
    </nav>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};
const token = JSON.parse(localStorage.getItem("token") || "null");

  const url = process.env.REACT_APP_API_URL;

  
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
const res = await fetch(`${url}/api/v1/user/${userId}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": ` ${token}`
  }
});        const data = await res.json();
        if (data.status) {
          setUser(data.data);
        } else {
          throw new Error(data.message || "User not found");
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, url]);

  if (!userId) return <p className="text-center mt-10">No user selected</p>;
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">User not found</p>;

  
  const openEditModal = () => {
    setEditForm({ name: user.name, email: user.email, password: "" });
    setErrors({});
    setShowEditModal(true);
  };

  
  const validate = () => {
    const newErrors = {};
    if (!editForm.name.trim()) newErrors.name = "Name is required";
    if (!editForm.email.trim()) newErrors.email = "Email is required";

    if (editForm.password && editForm.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch(`${url}/api/v1/user/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" ,
                "Authorization": `${token}` 

        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();

      if (!data.status) throw new Error(data.message || "Failed to update profile");

      setUser(data.data);
      toast.success("Profile updated successfully");

      const currentUser = JSON.parse(localStorage.getItem("user") || "null");
      if (currentUser?._id === user._id) {
        localStorage.setItem("user", JSON.stringify(data.data));
      }

      setShowEditModal(false);
    } catch (error) {
      toast.error(error.message);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <NavBar
        user={user}
        onAdd={() => toast.info("Add note clicked")}
      />

      {/* Profile Card */}
      <div className="flex items-center justify-center p-4 mt-8">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
          <div className="flex flex-col items-center">
            <img
              src={`https://i.pravatar.cc/150?u=${user.email}`}
              alt="Profile"
              className="w-28 h-28 rounded-full border-4 border-indigo-500"
            />
            <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{user.name}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Email</span>
              <span className="font-medium">{user.email}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Password</span>
              <span className="font-medium">••••••••</span>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={openEditModal}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-400"
            >
              <X />
            </button>

            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Name"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div className="mb-4">
                <input
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  placeholder="Email"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) =>
                    setEditForm({ ...editForm, password: e.target.value })
                  }
                  placeholder="New Password (leave blank to keep current)"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Profile;
