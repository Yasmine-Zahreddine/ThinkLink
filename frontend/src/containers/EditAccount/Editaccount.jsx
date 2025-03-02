import React, { useEffect, useState } from "react";
import "./editaccount.css";
import profile from "../../assets/logos/user.png";
import cookie from "js-cookie";
import deleteUserApi from "../../../api/deleteuser";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import Loadingspinner from "../../components/loading-spinner/Loadingspinner";
import { updateUserProfile } from "../../../api/update-profile";
import getuserdata from "../../../api/getuserdata";
import deleteConfirmationApi from "../../../api/delete-confirmation"; // Renamed import
import { FiCamera, FiUploadCloud, FiFile, FiCheckCircle, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import { FiAlertCircle } from "react-icons/fi"; // Import icon
import { User, Link2, Github, Linkedin, Loader2 } from 'lucide-react';
const Editaccount = () => {
  const navigate = useNavigate();
  const { isActive, setIsActive, setIsLoggedIn } = useAuth();

  const [fullName, setFullname] = useState("");
  const [description, setDescription] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [gitHub, setGitHub] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(profile);
  const [photoExists, setPhotoExists] = useState(false); 

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userId = cookie.get("userId");
      if (!userId) return;

      const response = await getuserdata(userId);
      setLoading(false);
      if (response.success) {
        setFirstName(response.data.first_name || "");
        setLastName(response.data.last_name || "");
        setDescription(response.data.description || "");
        setLinkedIn(response.data.linkedin_url || "");
        setGitHub(response.data.github_url || "");
        setFullname(`${response.data.first_name} ${response.data.last_name}`);
        setPreviewUrl(response.data.pfp_url || profile);
        setPhotoExists(!!response.data.pfp_url); 
        cookie.set('pfp_url', response.data.pfp_url);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    setMessage(""); 
  }, [isActive]);
  useEffect(() => {
    fetchUserData();
    if (!isActive) setIsActive("Profile");
  }, []);

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      setMessage("");
      const userId = cookie.get("userId");
      if (!userId) throw new Error("User ID not found in cookies");

      const response = await updateUserProfile({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        description,
        linkedin_url: linkedIn,
        github_url: gitHub,
      });

      setTimeout(() => {
        setMessage(response.success ? "Profile updated successfully." : "Failed to update profile.");
        fetchUserData();
        setLoading(false);
      }, 2000);
    } catch (error) {
      setTimeout(() => {
        setMessage(error.message || "An error occurred. Please try again.");
        setLoading(false);
      }, 2000);
      console.error("Error updating profile:", error);
    }
  };
  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file first!");
      return;
    }
  
    setLoading(true);
    setMessage("");
  
    try {
      const userId = cookie.get("userId");
      if (!userId) {
        throw new Error("User ID not found in cookies");
      }
  
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("file", selectedFile);
  
      const response = await fetch("http://localhost:8000/api/upload-photo", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok && result.success) {
        setMessage("Photo uploaded successfully!");
        setPreviewUrl(result.file_url); 
        setPhotoExists(true); 
  
        setTimeout(() => {
          window.location.replace(window.location.href);
        }, 1); 
      } else {
        throw new Error(result.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      setMessage(error.message);
    }
  };
  
  const handleDeletePhoto = async () => {
    setLoading(true);
    setMessage("");
  
    try {
      const userId = cookie.get("userId");
      if (!userId) {
        throw new Error("User ID not found in cookies");
      }
  
      const response = await fetch("http://localhost:8000/api/delete-photo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });
  
      const result = await response.json();
  
      if (response.ok && result.success) {
        setMessage("Photo deleted successfully!");
        setPreviewUrl(profile); 
        setPhotoExists(false); 
        setTimeout(() => {
          window.location.replace(window.location.href);
        }, 500); 
      } else {
        throw new Error(result.message || "Failed to delete photo.");
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      setMessage(error.message);
    }
  };
  

  const deleteUser = async () => { // Removed password parameter
    try {
      setLoading(true);
      setMessage("");

      const userId = cookie.get("userId");
      if (!userId) throw new Error("User ID not found in cookies");
      const confirmationResponse = await deleteConfirmationApi(userId, password);
      if (!confirmationResponse.success) {
        throw new Error(confirmationResponse.message || "Password verification failed.");
      }

      const deletionResponse = await deleteUserApi(userId);
      if (deletionResponse.success) {
        setLoading(false);
        setMessage("Account deleted successfully.");
        cookie.remove("userId");
        cookie.remove("fullName");
        cookie.remove("isActive");
        cookie.remove("isLoggedIn");
        setIsLoggedIn(false);
        navigate("/home");
      } else {
        throw new Error(deletionResponse.message || "Failed to delete account.");
      }
    } catch (error) {
      setLoading(false);
      setMessage(error.message || "An error occurred. Please try again.");
      console.error("Error deleting user:", error);
    } finally {
      setShowDeleteConfirmation(false);
      setPassword("");
    }
  };

  const removeAllCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "") // Trim spaces
        .replace(/=.*/, "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"); // Expire cookie
    });

    Object.keys(cookie.get()).forEach((key) => {
      cookie.remove(key, { path: "/" });
    });
  };

  const handleLogout = () => {
    setLoading(true);

    setTimeout(() => {
      removeAllCookies(); 

      setIsLoggedIn(false);
      navigate('/signin');
      setLogoutSpinner(false);
    }, 1000);
  };

  return (
    <>
      {loading && <Loadingspinner />}
      <div className="edit-account-container">
        <div className="edit-account-box">
          <div className="edit-account-box-options">
            <img src={previewUrl} alt="profile" className="profile-image" />
            <p className="Name">{fullName}</p>
            <div className="options">
              {["Profile", "Photo", "Privacy", "Help & Support", "Logout", "Delete Account"].map((option) => (
                <button
                  key={option}
                  className={`account-buttons ${isActive === option ? "isActive" : ""} ${option === "Delete Account" ? "delete" : ""}`}
                  onClick={() => setIsActive(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="edit-account-box-editable-container">
            <div className="edit-account-box-editable-body">
                {isActive === 'Logout' && (
                  <div className="logout-box">
                    <FiAlertCircle className="logout-icon" />
                    <h3 className="logout-title">Are you sure?</h3>
                    <p className="logout-message">Logging out will end your session. You can log in again anytime.</p>
                    
                    <div className="logout-buttons">
                      <button className="logout-btn confirm" onClick={handleLogout}>
                        Logout
                      </button>
                      <button className="logout-btn cancel" onClick={() => setIsActive('Profile')}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
               {isActive === "Profile" && (
  <div className="profile-edit-container">
    <div className="profile-edit-card">
      <h2 className="profile-edit-title">Edit Profile</h2>
      
      <div className="form-section">
        <label className="form-label">
          <User className="form-label-icon" />
          Full Name
        </label>
        <div className="name-fields-grid">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="form-section">
        <label className="form-label">
          <Link2 className="form-label-icon" />
          Description
        </label>
        <textarea
          placeholder="Tell us about yourself..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-textarea"
        />
      </div>

      <div className="form-section">
        <label className="form-label">Social Links</label>
        <div className="social-input-container">
          <div className="icon-input-wrapper">
            <Linkedin className="input-icon" />
            <input
              type="text"
              placeholder="LinkedIn Profile URL"
              value={linkedIn}
              onChange={(e) => setLinkedIn(e.target.value)}
              className="form-input with-icon"
            />
          </div>
          <div className="icon-input-wrapper">
            <Github className="input-icon" />
            <input
              type="text"
              placeholder="GitHub Profile URL"
              value={gitHub}
              onChange={(e) => setGitHub(e.target.value)}
              className="form-input with-icon"
            />
          </div>
        </div>
      </div>

      <button
        className="save-button"
        onClick={handleProfileUpdate}
        disabled={loading}
      >
        {loading ? (
          <div className="loading-spinner">
            <Loader2 className="spinner-icon" />
            Saving...
          </div>
        ) : (
          'Save Changes'
        )}
      </button>
      {message && (
        <div className={`message-feedback ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  </div>
)}
        {isActive === "Delete Account" && (
  <div className="logout-box delete-box">
    <FiAlertTriangle className="logout-icon" />
    <h3 className="logout-title">Delete Account Permanently?</h3>
    <p className="logout-message">
      This will remove all your data and cannot be undone. 
      Please confirm your identity to proceed.
    </p>

    {loading ? (
      <Loadingspinner />
    ) : (
      <div className="delete-content">
        <div className="delete-button-container">
          {!showDeleteConfirmation && (
            <button
              className="logout-btn confirm"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              Delete Account
            </button>
          )}
          
          {showDeleteConfirmation && (
            <div className="confirm-delete-box">
              <input
                type="password"
                className="confirm-delete-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="logout-buttons">
                <button
                  className="logout-btn confirm"
                  onClick={deleteUser}
                >
                  Confirm Delete
                </button>
                <button
                  className="logout-btn cancel"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        
        {message && (
          <div className={`message-feedback ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    )}
  </div>
)}

{isActive === "Help & Support" && (
  <div className="container">
    <div className="privacy-card">
      <h3 className="topics">📩 Contact Support</h3>
      <p className="parags">
        Reach out via email at <a className="email-link" href="mailto:officialthinklink@gmail.com">officialthinklink@gmail.com</a>
      </p>
    </div>

    <div className="privacy-card">
      <h3 className="topics">💬 Community Support</h3>
      <p className="parags">
        Join our <a href="https://discord.com" target="_blank" className="email-link">Discord server</a> or visit our <a href="https://forum.example.com" target="_blank" className="email-link">support forum</a> for discussions.
      </p>
    </div>

    <div className="privacy-card">
      <h3 className="topics">🐞 Report an Issue</h3>
      <p className="parags">
        Encountered a bug? <a href="https://github.com/example/issues" target="_blank" className="email-link">Submit an issue</a> on GitHub or use our feedback form.
      </p>
    </div>

    <div className="privacy-card">
      <h3 className="topics">📖 FAQs & Docs</h3>
      <p className="parags">
        Check out our <a href="https://docs.example.com" target="_blank" className="email-link">Documentation</a> and <a href="https://faq.example.com" target="_blank" className="email-link">FAQs</a> for quick answers.
      </p>
    </div>

    <div className="privacy-card">
      <h3 className="topics">📞 Live Chat</h3>
      <p className="parags">
        Need immediate help? Chat with our support team <a href="https://chat.example.com" target="_blank" className="email-link">here</a>.
      </p>
    </div>
  </div>
)}

{isActive === "Privacy" && (
  <div className="container">
    <div className="privacy-card">
      <h3 className="topics">🔍 Data Collection</h3>
      <p className="parags">
        We collect necessary data for account management and personalization.
      </p>
    </div>

    <div className="privacy-card">
      <h3 className="topics">🔐 Data Usage</h3>
      <p className="parags">
        We use your data securely for authentication and improving services.
      </p>
    </div>

    <div className="privacy-card">
      <h3 className="topics">⚖️ User Rights</h3>
      <p className="parags">
        You can request data deletion or export at any time.
      </p>
    </div>

    <div className="privacy-card">
      <h3 className="topics">🛡️ Security Measures</h3>
      <p className="parags">
        Your passwords are encrypted, and we follow best security practices.
      </p>
    </div>

    <div className="privacy-card">
      <h3 className="topics">🍪 Cookies & Tracking</h3>
      <p className="parags">
        We use cookies to improve user experience. You can opt out anytime.
      </p>
    </div>
  </div>
)}

              {isActive === "Photo" && (
                <div className="professional-photo-section">
                  <div className="upload-card">
                    <div className="upload-header">
                      <FiCamera className="camera-icon" />
                      <h3>Profile Picture</h3>
                      <p className="subtext">Recommended size: 500x500 pixels</p>
                    </div>

                    <div className="upload-content">
                      <div className="preview-container">
                        <div className="avatar-wrapper">
                          <img
                            src={previewUrl || profile}
                            alt="Profile preview"
                            className={`avatar-preview ${previewUrl ? 'has-image' : ''}`}
                          />
                          <label htmlFor="file-input" className="upload-overlay">
                            <FiUploadCloud className="upload-icon" />
                            <span>Upload Photo</span>
                          </label>
                        </div>
                      </div>

                      <input
                        id="file-input"
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleFileChange}
                        hidden
                      />

                      <div className="file-details">
                        {selectedFile ? (
                          <>
                            <div className="file-meta">
                              <FiFile className="file-icon" />
                              <div>
                                <p className="filename">{selectedFile.name}</p>
                                <p className="filesize">
                                  {(selectedFile.size / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                            <div className="action-buttons">
                              <button
                                className="btn-primary"
                                onClick={handleUpload}
                                disabled={loading}
                              >
                                {loading ? 'Uploading...' : 'Save Changes'}
                              </button>
                              <button
                                className="btn-secondary"
                                onClick={() => {
                                  setSelectedFile(null);
                                  setPreviewUrl('');
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="upload-instructions">
                            <p className="drag-text">Drag and drop or</p>
                            <label htmlFor="file-input" className="browse-button">
                              Browse Files
                            </label>
                            <p className="format-info">
                              Supported formats: JPG, PNG, GIF (Max 5MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {photoExists && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    marginTop: "2rem",
                    alignContent: "center",
                    justifyItems: "center",
                  }}
                >
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#e53e3e",
                      color: "white",
                      padding: "0.75rem 1.5rem",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease",
                      fontSize: "1rem",
                      marginTop: "10px",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#c53030";
                      e.target.style.transform = "scale(1.05)";
                      e.target.style.boxShadow = "0px 8px 15px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = "#e53e3e";
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "none";
                    }}
                    onMouseDown={(e) => {
                      e.target.style.transform = "scale(0.98)";
                      e.target.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseUp={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "0px 8px 15px rgba(0, 0, 0, 0.2)";
                    }}
                    onClick={handleDeletePhoto}
                    disabled={loading}
                  >
                    <FiTrash2 style={{ marginRight: "0.5rem", fontSize: "1.2rem" }} />
                    Delete Photo
                  </button>
                </div>
              )}


                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Editaccount;