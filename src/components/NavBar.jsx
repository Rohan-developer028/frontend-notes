import { Plus, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NavBar = ({ user, search, onSearchChange, onAdd }) => {
  const navigate = useNavigate();

  const goHome = () => navigate("/"); 

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={goHome}
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            N
          </div>
          <span className="text-lg font-semibold">Notes</span>
        </div>

        {/* Search */}
        <div className="hidden md:flex flex-1 mx-8">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={onSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <SearchIcon />
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onAdd}
            className=" flex bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
          >
            <Plus/> Add
          </button>

          <img
            src={`https://i.pravatar.cc/40?u=${user?.email}`}
            alt="profile"
            onClick={() =>
              navigate("/profile", { state: { userId: user?._id } })
            }
            className="w-9 h-9 rounded-full cursor-pointer ring-2 ring-indigo-500"
          />
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={onSearchChange}
          className="w-full px-4 py-2 rounded-xl bg-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>
    </nav>
  );
};

export default NavBar;
