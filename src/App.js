import { useEffect, useRef, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import ContactList from "./components/ContactList";
import ContactDetail from "./components/ContactDetail";
import Register from "./components/Register";
import Login from "./components/Login";

import { getContacts, saveContact, updatePhoto, searchContacts, deleteContact } from "./api/ContactService";
import { toastError } from "./api/ToastService";

function App() {
  const modalRef = useRef();
  const fileRef = useRef();

  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(
  !!localStorage.getItem("token")
);

  const [searchQuery, setSearchQuery] = useState("");
  const searchTimerRef = useRef(null);

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    status: "",
    date: new Date().toISOString().split("T")[0],
  });

  /* ===================== AUTH CHECK ===================== */

const handleLogout = () => {
  localStorage.removeItem("token");
  setIsAuthenticated(false);
};


  /* ===================== CONTACT APIs ===================== */
  const getAllContacts = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
    } catch (error) {
      console.error(error);
      toastError(error.message);
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };



  const validateContact = () => {
  if (values.name.trim().length < 3) {
    toastError("Name must be at least 3 characters");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(values.email)) {
    toastError("Please enter a valid email address");
    return false;
  }

  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(values.phone)) {
    toastError("Phone number must be 10–15 digits");
    return false;
  }

  if (values.title.trim().length === 0) {
    toastError("Title is required");
    return false;
  }

  if (values.address.trim().length < 5) {
    toastError("Address must be at least 5 characters");
    return false;
  }

  if (values.status.trim().length === 0) {
    toastError("Status is required");
    return false;
  }

  if (!file) {
    toastError("Please select a profile photo");
    return false;
  }

  return true;
};

  const handleNewContact = async (e) => {
    e.preventDefault();
if (!validateContact()) return;

    try {
      const { data } = await saveContact(values);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", data.id);

      await updatePhoto(formData);

      toggleModal(false);
      setFile(undefined);
      fileRef.current.value = null;
      setValues({
        name: "",
        email: "",
        phone: "",
        address: "",
        title: "",
        status: "",
        date: new Date().toISOString().split("T")[0],
      });

      getAllContacts();
    } catch (error) {
      console.error(error);
      toastError(error.message);
    }
  };

  const updateContact = async (contact) => {
    try {
      await saveContact(contact);
    } catch (error) {
      console.error(error);
      toastError(error.message);
    }
  };

  const updateImage = async (formData) => {
    try {
      await updatePhoto(formData);
    } catch (error) {
      console.error(error);
      toastError(error.message);
    }
  };

  /* ===================== SEARCH ===================== */
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(async () => {
      try {
        if (query.trim()) {
          const { data } = await searchContacts(query, 0, 10);
          setData(data);
          setCurrentPage(0);
        } else {
          getAllContacts(0);
        }
      } catch (error) {
        console.error(error);
        toastError(error.message);
      }
    }, 300);
  };

  const handleDeleteContact = async (id) => {
    try {
      await deleteContact(id);
      getAllContacts();
    } catch (error) {
      console.error(error);
      toastError(error.message);
    }
  };

  /* ===================== MODAL ===================== */
  const toggleModal = (show) =>
    show ? modalRef.current.showModal() : modalRef.current.close();

  /* ===================== LOAD DATA ===================== */
  useEffect(() => {
  if (isAuthenticated) {
    getAllContacts();
  }
}, [isAuthenticated]);


  /* ===================== RENDER ===================== */
  return (
    <>
     {isAuthenticated && (
       <Header
  toggleModal={toggleModal}
  nbOfContacts={data.totalElements}
  onLogout={handleLogout}
  searchQuery={searchQuery}
  onSearchChange={handleSearchChange}
/>
     )}


      <main className="main">
        <div className="container">
         <Routes>
  {/* App starts at Register */}
  <Route path="/" element={<Navigate to="/register" />} />

  {/* Auth routes */}
  <Route
    path="/register"
    element={isAuthenticated ? <Navigate to="/contacts" /> : <Register />}
  />

  <Route
  path="/login"
  element={
    isAuthenticated ? (
      <Navigate to="/contacts" />
    ) : (
      <Login setIsAuthenticated={setIsAuthenticated} />
    )
  }
/>


  {/* Protected routes */}
  <Route
    path="/contacts"
    element={
      isAuthenticated ? (
        <ContactList
          data={data}
          currentPage={currentPage}
          getAllContacts={getAllContacts}
        />
      ) : (
        <Navigate to="/login" />
      )
    }
  />

  <Route
    path="/contacts/:id"
    element={
      isAuthenticated ? (
        <ContactDetail
          updateContact={updateContact}
          updateImage={updateImage}
          onDeleteContact={handleDeleteContact}
        />
      ) : (
        <Navigate to="/login" />
      )
    }
  />
</Routes>

        </div>
      </main>

      {/* ===================== MODAL ===================== */}
      <dialog ref={modalRef} className="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i
            onClick={() => toggleModal(false)}
            className="bi bi-x-lg"
          ></i>
        </div>

        <div className="divider"></div>

        <div className="modal__body">
          <form onSubmit={handleNewContact}>
            <div className="user-details">
              {["name", "email", "title", "phone", "address", "status", "date"].map(
                (field) => (
                  <div className="input-box" key={field}>
                    <span className="details">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                    <input
                      type={field === "date" ? "date" : "text"}
                      name={field}
                      value={values[field]}
                      onChange={onChange}
                      required
                    />
                  </div>
                )
              )}

              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input
                  type="file"
                  ref={fileRef}
                  onChange={(e) => setFile(e.target.files[0])}
                  required
                />
              </div>
            </div>

            <div className="form_footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => toggleModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <ToastContainer />
    </>
  );
}

export default App;
