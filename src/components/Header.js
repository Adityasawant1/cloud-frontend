import React from "react";

const Header = ({ toggleModal, nbOfContacts, onLogout, searchQuery, onSearchChange }) => {
  return (
    <header className="header">
      <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Contact List ({nbOfContacts})</h3>

        <div className="search-bar">
          <i className="bi bi-search search-bar__icon"></i>
          <input
            type="text"
            className="search-bar__input"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <i
              className="bi bi-x-lg search-bar__clear"
              onClick={() => onSearchChange("")}
            ></i>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => toggleModal(true)} className="btn">
            <i className="bi bi-plus-square"></i> Add New Contact
          </button>

          <button onClick={onLogout} className="btn btn-danger">
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
