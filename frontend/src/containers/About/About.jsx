import React from 'react';
import './about.css';

const About = () => {
  return (
    <div className="thinklink__about section__padding" id="about">
      <div className="thinklink__about-content">
        <h1 className="gradient_text">Welcome to ThinkLink: Where Learning Meets AI</h1>
        
        <div className="thinklink__about-description">
          <h2>Our Mission</h2>
          <p>ThinkLink is revolutionizing online learning by combining the vast knowledge of YouTube's educational content with cutting-edge AI technology. We're committed to making learning more accessible, interactive, and personalized for everyone.</p>
        </div>

        <div className="thinklink__about-features">
          <div className="feature">
            <h3>Curated Learning Paths</h3>
            <p>Access carefully selected YouTube courses across various disciplines, organized for optimal learning progression.</p>
          </div>

          <div className="feature">
            <h3>AI Learning Assistant</h3>
            <p>Our intelligent AI companion helps you understand complex topics, answers your questions in real-time, and provides additional context when needed.</p>
          </div>

          <div className="feature">
            <h3>Interactive Learning Experience</h3>
            <p>Engage with content through smart summaries, practice questions, and personalized recommendations tailored to your learning style.</p>
          </div>
        </div>

        <div className="thinklink__about-vision">
          <h2>Our Vision</h2>
          <p>We envision a future where quality education is accessible to everyone, everywhere. By combining the power of AI with carefully curated educational content, we're building a platform that adapts to each learner's needs and helps them achieve their goals.</p>
        </div>

        <div className="thinklink__about-join">
          <h2>Join Our Learning Community</h2>
          <p>Whether you're a student, professional, or lifelong learner, ThinkLink is here to support your educational journey. Start exploring our courses today and experience the future of learning.</p>
        </div>
      </div>
    </div>
  );
};

export default About;