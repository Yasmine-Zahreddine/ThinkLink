import "./signup.css";
import { useState } from "react";
const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("User signed up successfully!");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        setMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="sign-in-up">
      {message && <p className="message">{message}</p>}
      <div className="Back-cont">
        <a href="/">
          <img src="/path/to/back.png" alt="back" className="backimage" />
        </a>
      </div>

      <form className="sign-in-up-box" onSubmit={handleSubmit}>
        <div className="signup-word-cont">
          <h2>Sign up</h2>
        </div>

        <div className="input-cont">
          <img src="/path/to/profile.png" alt="profile" className="profile" />
          <input
            className="input"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-cont">
          <img src="/path/to/email.png" alt="email" className="email" />
          <input
            className="input"
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-cont">
          <img
            src="/path/to/password.png"
            alt="password"
            className="password"
          />
          <input
            className="input"
            placeholder="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-cont">
          <img
            src="/path/to/password.png"
            alt="password"
            className="password"
          />
          <input
            className="input"
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="Create-Account-cont">
          <button type="submit" className="Create-Account-button">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};
export default Signup;
