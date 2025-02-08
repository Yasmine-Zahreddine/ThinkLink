import React, { useEffect, useState } from "react";
import "./editaccount.css";
import profile from "../../assets/logos/user.png";
import cookie from "js-cookie";
import deleteUserApi from "../../../api/deleteuser";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Loadingspinner from "../../components/loading-spinner/Loadingspinner"; // Import the spinner component

const Editaccount = () => {
  const navigate = useNavigate();
  const { isActive, setIsActive } = useAuth();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const [fullName, setFullname] = useState("");
  const [description, setDescription] = useState("Add information about yourself");
  const [headline, setHeadline] = useState("");
  const [charCount, setCharCount] = useState(60);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [gitHub, setGitHub] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading spinner

  const menuOptions = [
    { label: "Profile" },
    { label: "Photo" },
    { label: "Privacy" },
    { label: "Help & Support" },
    { label: "Delete Account", className: "delete" },
  ];

  useEffect(() => {
    const name = cookie.get("fullName");
    setFullname(name || "");
    if (name) {
      const nameParts = name.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts[1] || "");
    }
    if (!isActive) {
      setIsActive("Profile");
    }
  }, []);

  useEffect(() => {
    switch (isActive) {
      case "Profile":
        setDescription("Update your basic information");
        break;
      case "Photo":
        setDescription("Upload and manage your profile picture");
        break;
      case "Privacy":
        setDescription("Adjust your privacy settings");
        break;
      case "Help & Support":
        setDescription("Get help and support for your account");
        break;
      case "Delete Account":
        setDescription("");
        break;
      default:
        setDescription("Add information about yourself");
    }
  }, [isActive]);

  const handleDeleteUser = async () => {
    try {
      setLoading(true); // Show spinner
      setMessage(""); // Clear previous messages

      const userId = cookie.get("userId");
      if (!userId) throw new Error("User ID not found in cookies");

      const response = await deleteUserApi(userId);

      // Ensure the spinner is shown for at least 2 seconds
      setTimeout(() => {
        if (response.success) {
          setMessage("Account deleted successfully.");
          cookie.remove("userId");
          setIsLoggedIn(false);
          navigate("/home");
        } else {
          setMessage("Failed to delete account.");
        }
        setLoading(false); // Hide spinner
      }, 2000);
    } catch (error) {
      setTimeout(() => {
        setMessage("An error occurred. Please try again.");
        setLoading(false); // Hide spinner
      }, 2000);
      console.error("Error deleting user:", error.message);
    }
  };

  const handleHeadlineChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 60) {
      setHeadline(inputValue);
      setCharCount(60 - inputValue.length);
    }
  };

  const handleChange = (e, setChange) => {
    setChange(e.target.value);
  };

  return (
    <div className="edit-account-container">
      <div className="edit-account-box">
        {/* Sidebar */}
        <div className="edit-account-box-options">
          <img src={profile} alt="profile" className="profile-image" />
          <p className="Name">{fullName}</p>
          <div className="options">
            {menuOptions.map((option) => (
              <button
                key={option.label}
                className={`account-buttons ${isActive === option.label ? "isActive" : ""} ${option.className || ""}`}
                onClick={() => setIsActive(option.label)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editable Section */}
        <div className="edit-account-box-editable-container">
          <div className="edit-account-box-editable-header">
            <h2 className="header-edit-account">{isActive}</h2>
            <p className="description">{description}</p>
          </div>

          <div className="edit-account-box-editable-body">
            {/* Profile Section */}
            {isActive === "Profile" && (
              <div className="profile-body">
                <div className="input-group">
                  <h3 className="header-3">Basics:</h3>
                  <input type="text" placeholder="First Name" value={firstName} onChange={(e) => handleChange(e, setFirstName)} />
                </div>
                <div className="input-group">
                  <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => handleChange(e, setLastName)} />
                </div>
                <div className="input-group">
                  <input type="text" placeholder="Headline" value={headline} onChange={handleHeadlineChange} />
                  <span className="char-count">{charCount}</span>
                </div>
                <p className="hint">Add a professional headline</p>
                <div className="input-group">
                  <textarea placeholder="Write about yourself..."></textarea>
                </div>

                <div className="input-group">
                  <h3 className="header-3">Links:</h3>
                  <input type="text" placeholder="LinkedIn Profile URL" value={linkedIn} onChange={(e) => handleChange(e, setLinkedIn)} />
                </div>
                <div className="input-group">
                  <input type="text" placeholder="GitHub Profile URL" value={gitHub} onChange={(e) => handleChange(e, setGitHub)} />
                </div>

                <div className="save-button-container">
                  <button className="button">Save</button>
                </div>
              </div>
            )}
            {isActive === "Delete Account" && (
              <div className="delete-account-section">
                <h3 className="header3">Are you sure?</h3>
                <p className="warning">This action cannot be undone.</p>
                <p className="warning">Proceed with caution.</p>

                {loading ? (
                  <Loadingspinner /> 
                ) : (
                  <>
                    <div className="delete-button-container">
                      <button className="button delete-button" onClick={handleDeleteUser}>
                        Delete My Account
                      </button>
                    </div>
                    {message && <p className="delete-message">{message}</p>}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editaccount;
