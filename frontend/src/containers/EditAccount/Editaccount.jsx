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
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [password, setPassword] = useState("");

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

  const deleteUser = async () => {
    try {
      setLoading(true);
      setMessage("");
      const userId = cookie.get("userId");
      if (!userId) throw new Error("User ID not found in cookies");

      const response = await deleteUserApi(userId);
      setTimeout(() => {
        if (response.success) {
          setMessage("Account deleted successfully.");
          cookie.remove("userId");
          setIsLoggedIn(false);
          navigate("/home");
        } else {
          setMessage("Failed to delete account.");
        }
        setLoading(false);
      }, 2000);
    } catch (error) {
      setTimeout(() => {
        setMessage("An error occurred. Please try again.");
        setLoading(false);
      }, 2000);
      console.error("Error deleting user:", error.message);
    }
  };

  return (
    <>

    {loading && <Loadingspinner/>}
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
                      <button className="button delete-button" onClick={() => setDeleteConfirmation(true)}>Delete My Account</button>
                    </div>
                    {message && <p className="delete-message">{message}</p>}
                    {deleteConfirmation && (
                      <div className="confirm-delete-box">
                        <input
                          type="password"
                          className="confirm-delete-input"
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className="button delete-button" onClick={deleteUser}>Confirm Delete</button>
                      </div>

                    )}
                  </>
                )}
              </div>
            )}
            
            {isActive === "Help & Support" && 
                        <div className="container">
                         
                          <div className="support-card">
                            <h3 className="topics">Contact Support</h3>
                            <p className="parags">Reach out via email <a className="email-link" href="to:officialthinklink@gmail.com">officialthinklink@gmail.com</a></p>
                          </div>
                          <div className="support-card">
                            <h3 className="topics">Community Support</h3>
                            <p className="parags">Join our forums and discussions.</p>
                          </div>
                          <div className="support-card">
                            <h3 className="topics">Report an Issue</h3>
                            <p className="parags">Let us know if you encounter any bugs.</p>
                          </div>
                        </div>
                    }
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Editaccount;
