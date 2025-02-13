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
import { FiCamera, FiUploadCloud, FiFile, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // Renamed state
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
const [previewUrl, setPreviewUrl] = useState("");

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
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

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
  
      const token = cookie.get("authToken"); // Ensure this contains the user's authentication token
  
      const response = await fetch("http://localhost:8000/api/upload-photo", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok && result.success) {
        setMessage("Photo uploaded successfully!");
        setPreviewUrl(result.file_url); // Update the UI with the new profile photo
      } else {
        throw new Error(result.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  


  const deleteUser = async () => { // Removed password parameter
    try {
      setLoading(true);
      setMessage("");

      const userId = cookie.get("userId");
      if (!userId) throw new Error("User ID not found in cookies");

      // Use the password from state
      const confirmationResponse = await deleteConfirmationApi(userId, password);
      if (!confirmationResponse.success) {
        throw new Error(confirmationResponse.message || "Password verification failed.");
      }

      const deletionResponse = await deleteUserApi(userId);
      if (deletionResponse.success) {
        setMessage("Account deleted successfully.");
        cookie.remove("userId");
        setIsLoggedIn(false);
        navigate("/home");
      } else {
        throw new Error(deletionResponse.message || "Failed to delete account.");
      }
    } catch (error) {
      setMessage(error.message || "An error occurred. Please try again.");
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
      setShowDeleteConfirmation(false);
      setPassword("");
    }
  };

  return (
    <>
      {loading && <Loadingspinner />}
      <div className="edit-account-container">
        <div className="edit-account-box">
          <div className="edit-account-box-options">
            <img src={profile} alt="profile" className="profile-image" />
            <p className="Name">{fullName}</p>
            <div className="options">
              {["Profile", "Photo", "Privacy", "Help & Support", "Delete Account"].map((option) => (
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
              {isActive === "Profile" && (
                <div className="profile-body">
                  <div className="input-group">
                    <label className="labels">Full Name :</label>
                    <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                  
                  <div className="input-group">
                    <label className="labels">Description :</label>
                    <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  </div>
                  
                  <div className="input-group">
                    <label className="labels">Links :</label>
                    <input type="text" placeholder="LinkedIn Profile URL" value={linkedIn} onChange={(e) => setLinkedIn(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <input type="text" placeholder="GitHub Profile URL" value={gitHub} onChange={(e) => setGitHub(e.target.value)} />
                  </div>
                  <div className="save-button-container">
                    <button className="button" onClick={handleProfileUpdate}>Save</button>
                  </div>
                  {message && <p className="message">{message}</p>}
                </div>
              )}

              {isActive === "Delete Account" && (
                <div className="delete-account-section">
                  <h3 className="header3">Are you sure?</h3>
                  <p className="warning">This action cannot be undone.</p>
                  {loading ? <Loadingspinner /> : (
                    <>
                      <div className="delete-button-container">
                        {!showDeleteConfirmation && (
                          <button 
                            className="button delete-button" 
                            onClick={() => setShowDeleteConfirmation(true)}
                          >
                            Delete My Account
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
                            <button 
                              className="button delete-button" 
                              onClick={deleteUser}
                            >
                              Confirm Delete
                            </button>
                          </div>
                        )}
                      </div>
                      {message && <p className="delete-message">{message}</p>}
                    </>
                  )}
                </div>
              )}
                {isActive === "Help & Support" && 
                        <div className="container">
                         
                          <div className="privacy-card">
                            <h3 className="topics">Contact Support</h3>
                            <p className="parags">Reach out via email <a className="email-link" href="to:officialthinklink@gmail.com">officialthinklink@gmail.com</a></p>
                          </div>
                          <div className="privacy-card">
                            <h3 className="topics">Community Support</h3>
                            <p className="parags">Join our forums and discussions.</p>
                          </div>
                          <div className="privacy-card">
                            <h3 className="topics">Report an Issue</h3>
                            <p className="parags">Let us know if you encounter any bugs.</p>
                          </div>
                        </div>
                    }
                {isActive === "Privacy" &&  <div className="container">
                    <div className="privacy-card">
                      <h3>Data Collection</h3>
                      <p>We collect necessary data for account management and personalization.</p>
                    </div>
                    <div className="privacy-card">
                      <h3>Data Usage</h3>
                      <p>We use your data securely for authentication and improving services.</p>
                    </div>
                    <div className="privacy-card">
                      <h3>User Rights</h3>
                      <p>You can request data deletion or export at any time.</p>
                    </div>
                    <div className="privacy-card">
                      <h3>Security Measures</h3>
                      <p>Your passwords are encrypted, and we follow best security practices.</p>
                    </div>
                    <div className="privacy-card">
                      <h3>Cookies & Tracking</h3>
                      <p>We use cookies to improve user experience. You can opt out anytime.</p>
                    </div>
                  </div>
    }
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
                          <span>Update Photo</span>
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

                  {message && (
                    <div className={`status-message ${message.includes('success') ? 'success' : 'error'}`}>
                      {message.includes('success') ? <FiCheckCircle /> : <FiAlertTriangle />}
                      {message}
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