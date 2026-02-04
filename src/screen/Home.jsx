import { Edit, Heart, SearchIcon, X } from "lucide-react";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/ReactToastify.css"
import NavBar from "../components/NavBar";

const initialNotes = [
  {
    id: 1,
    title: "React Basics",
    content: "Components, props, state, hooks overview",
    rating: 4.5,
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    title: "Tailwind Tips",
    content: "Utility-first CSS, responsive design, dark mode",
    rating: 4.8,
    createdAt: "2024-01-15",
  },
];

export default function Home() {
  const navigate = useNavigate();

   const [search, setSearch] = useState("");
const [notes, setNotes] = useState([]);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [Contentload, setContentload] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [errors, setErrors] = useState({});
 const [loading, setLoading] = useState(false);
 const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState(null);
const [searchLoading, setSearchLoading] = useState(false);



const user = JSON.parse(localStorage.getItem("user") || "null");
const token = JSON.parse(localStorage.getItem("token") || "null");

  const url = process.env.REACT_APP_API_URL;

  const openAddModal = () => {
    setEditingId(null);
    setForm({ title: "", content: "" });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = async(note) => {
    try{
   const res = await fetch(`${url}/api/v1/note/${note._id}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `${token}` 
  }
});
    const data = await res.json();
    console.log(data)
     if(data.status)
     {
       setEditingId(note._id);

    setForm({ title: data.data?.title, content: data.data?.content });
    setErrors({});
    setShowModal(true);
     }
     else{
     throw new Error(data.message || "Something went wrong");
     }
    }
    catch(error)
    {
toast.error(error.message || "Failed to fetch note ");
    }
  
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.content.trim()) newErrors.content = "Content is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    if (!validate()) return;
     setLoading(true);
try {
    if (editingId) {
      
        const res = await fetch(`${url}/api/v1/editnote/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
              "Authorization": `${token}` 

        },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          userId: user._id,
        }),
      });

      const data = await res.json();

      if (data.status) {
         toast.success(data.message|| "Note updated successfully");
         fetchNotes(page)
         setShowModal(false);
        
      }
    else
     throw new Error(data.message || "Failed to update note");
      }
     
     else {

    const res = await fetch(`${url}/api/v1/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
            "Authorization": `${token}` 

      },
      body: JSON.stringify({
        title: form.title,
        content: form.content,
        userId: user._id,
      }),
    });

    const data = await res.json();
 console.log(data)
    if (data.status) {
      
       toast.success("Note added successfully ");
    setForm({ title: "", content: "" });
    fetchNotes(page)
    setShowModal(false);
     
    }
    else
     throw new Error(data.message || "Something went wrong");

  }
  }
   catch (error) {
    toast.error(error.message || "Failed to add note ");
  } finally {
    setLoading(false);
  }
    
  };

  const fetchNotes = async (pageNumber = 1) => {
  try {
    setLoading(true);

    

    if (!user?._id) return;

    const res = await fetch(
      `${url}/api/v1/notes/${user._id}?page=${pageNumber}&limit=6`
    );

    const data = await res.json();

    if (data.status) {
      setNotes(data.data);
      setPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    }
  } catch (error) {
    toast.error("Error fetching notes", error);
    
  } finally {
    setLoading(false);
  }
};



useEffect(() => {
  fetchNotes(page);
}, [page]);

const handleDelete = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${url}/api/v1/deletenote/${deleteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
            "Authorization": `${token}` 

      },
      body: JSON.stringify({
        userId: user._id,
      }),
    });

    const data = await res.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to delete note");
    }

    toast.success("Note deleted successfully +");
    fetchNotes(page);
  } catch (error) {
    toast.error(error.message || "Error deleting note");
  } finally {
    setLoading(false);
    setShowDeleteModal(false);
    setDeleteId(null);
  }
};
const searchNotes = async (value) => {
  try {
    setSearchLoading(true);
    const res = await fetch(
      `${url}/api/v1/searchnotes?query=${value}&userId=${user._id}`
    );

    const data = await res.json();

    if (!data.status) {
      throw new Error(data.message);
    }

    setNotes(data.data);
  } catch (error) {
    toast.error(error.message || "Search failed");
  } finally {
    setSearchLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-50">

     
     <NavBar
  user={user}
  search={search}
  setSearch={setSearch}
  onSearchChange={(e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim() === "") {
      fetchNotes(page);
    } else {
      searchNotes(value);
    }
  }}
  onAdd={openAddModal}
/>


 

    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">


  {Contentload && (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
  )}

 
  {!Contentload && notes.length === 0 && (
    <div className="text-center text-gray-500 py-20">
      <p className="text-lg font-medium">No notes found</p>
      <p className="text-sm">Start by adding your first note </p>
    </div>
  )}


  {!Contentload && notes.length > 0 && (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
     {notes.map((note) => (
  <div
    key={note._id}
    className="relative bg-white rounded-2xl shadow hover:shadow-lg transition p-5"
  >
    
    <button
    onClick={() => { setDeleteId(note._id);
    setShowDeleteModal(true);
  }}
      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
      title="Delete note"
    >
      <X/>
    </button>

    <h3 className="font-semibold text-lg">{note.title}</h3>

    <p className="text-gray-600 text-sm mt-2 h-20 max-h-20 overflow-y-auto">
      {note.content}
    </p>

    <div className="flex justify-between items-center mt-4">
      <span className="text-sm bg-yellow-100 px-3 py-1 rounded-full">
      <Heart/>
      </span>

      <button
        onClick={() => openEditModal(note)}
        className="text-indigo-600 text-sm font-medium"
      >
        <Edit/>
      </button>
    </div>
  </div>
))}
    </div>
  )}

 
  {!Contentload  && (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
      >
        Prev
      </button>

      <span className="text-sm font-medium">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )}

</div>


     
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400"
            >
              <X/>
            </button>

            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Note" : "Add Note"}
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="Title"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <textarea
                  rows={4}
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  placeholder="Content"
                  className="w-full px-3 py-2 border rounded-lg"
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.content}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700"
              >
                {
                  editingId?"update":"save"
                }
                {
                  loading?"...":""
                }
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
      <h3 className="text-lg font-semibold">Delete Note</h3>
      <p className="text-sm text-gray-600 mt-2">
        Are you sure you want to delete this note?
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => {
            setShowDeleteModal(false);
            setDeleteId(null);
          }}
          className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


      <ToastContainer/>
    </div>
  );
}
