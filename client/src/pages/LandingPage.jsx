import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './LandingPage.css';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const productContainerRef = useRef(null);
  const [activeNav, setActiveNav] = useState('home');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (navItem) => {
    setActiveNav(navItem);
    setMobileMenuOpen(false);
  };

  const scrollContainer = (direction) => {
    if (productContainerRef.current) {
      const container = productContainerRef.current;
      const width = container.getBoundingClientRect().width;
      if (direction === 'next') {
        container.scrollLeft += width;
      } else {
        container.scrollLeft -= width;
      }
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/feedback', {
        email: feedbackEmail,
        message: feedbackMessage
      });
      alert('Feedback submitted successfully!');
      setFeedbackEmail('');
      setFeedbackMessage('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback.');
    }
  };

  return (
    <>
      {/* Navbar Section */}
      <nav className="navbar">
        <div className="navbar__container">
          <Link to="/" id="navbar__logo">FreeToWork.</Link>
          <div 
            className={`navbar__toggle ${mobileMenuOpen ? 'is-active' : ''}`} 
            id="mobile-menu"
            onClick={toggleMobileMenu}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
          <ul className={`navbar__menu ${mobileMenuOpen ? 'active' : ''}`}>
            <li className="navbar__item">
              <a 
                href="#MAIN" 
                className="navbar__links nav_home" 
                style={{ color: activeNav === 'home' ? '#fc6060' : 'white' }}
                onClick={() => handleNavClick('home')}
              >
                Home
              </a>
            </li>
            <li className="navbar__item">
              <a 
                href="#TECH" 
                className="navbar__links nav_tech" 
                style={{ color: activeNav === 'tech' ? '#fc6060' : 'white' }}
                onClick={() => handleNavClick('tech')}
              >
                Tech
              </a>
            </li>
            <li className="navbar__item">
              <a 
                href="#SERVICES" 
                className="navbar__links nav_jobs" 
                style={{ color: activeNav === 'jobs' ? '#fc6060' : 'white' }}
                onClick={() => handleNavClick('jobs')}
              >
                Jobs
              </a>
            </li>
            <li className="navbar__btn">
              <Link to="/login" className="button">Sign in</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Section */}
      <div className="main" id="MAIN">
        <div className="main__container">
          <div className="main__content">
            <h1>Introducing FreeToWork</h1>
            <h2>Bangladesh's Premier Online Job Marketplace </h2>
            <p>For both Professionals and Non-Professionals.</p>
            <button className="main__btn">
              <Link to="/login">Get Started</Link>
            </button>
          </div>
          <div className="main__img--container">
            <img id="main__img" src="/home_page/images/pic1.svg" alt="Main" />
          </div>
        </div>
      </div>

      {/* Tech Section */}
      <section className="about" id="TECH">
        <div className="container">
          <div className="about-content">
            <div className="about-icon">
              <ion-icon name="barcode-outline"></ion-icon>
            </div>

            <h2 className="h2 about-title">How our Technology Works</h2>

            <p className="about-text">
              Welcome to the Tech section of FreeToWork, the online job marketplace in Bangladesh. Here, we'll explain in simpler terms how our technology makes it easy to find jobs.
            </p>

            <button className="btn btn-outline">Learn More</button>
          </div>

          <ul className="about-list">
            <li>
              <div className="about-card">
                <div className="card-icon">
                  <ion-icon name="search-outline"></ion-icon>
                </div>

                <h3 className="h3 card-title">Convenient Job Posting and Searching</h3>

                <p className="card-text">
                  Our website helps people find local jobs nearby. If you're looking to hire or apply for a job, FreeToWork is the place to be. 
                  Job posters can share details about available positions and tag them under specific categories. This makes it easier for job seekers to browse through and find the jobs that match their interests.
                </p>
              </div>
            </li>

            <li>
              <div className="about-card">
                <div className="card-icon">
                  <ion-icon name="notifications-outline"></ion-icon>
                </div>

                <h3 className="h3 card-title">Stay Connected with Job Notifications</h3>

                <p className="card-text">
                  To stay connected and receive timely updates, users can sign up using their National Identification (NID) number. We use this information to ensure a safe and trustworthy community. 
                  Once registered, users can turn on the online status button. This enables them to receive notifications about new jobs and updates.
                </p>
              </div>
            </li>

            <li>
              <div className="about-card">
                <div className="card-icon">
                  <ion-icon name="swap-vertical-outline"></ion-icon>
                </div>

                <h3 className="h3 card-title">Personalize Your Job Search Experience</h3>

                <p className="card-text">
                  In the newsfeed section, we provide sorting options to personalize your job search experience. 
                  You can filter job listings based on industries, locations, and other relevant factors. This way, you can quickly find the jobs that suit your needs and preferences.
                </p>
              </div>
            </li>

            <li>
              <div className="about-card">
                <div className="card-icon">
                  <ion-icon name="server"></ion-icon>
                </div>

                <h3 className="h3 card-title"> Embracing Technology for Effortless Job Hunting</h3>

                <p className="card-text">
                  At FreeToWork, we're committed to using technology to make job hunting easier and more efficient.
                   Our platform connects job seekers with employers, helping them discover new opportunities and contribute to Bangladesh's economic growth. Join us today and explore the future of online job marketplaces with FreeToWork.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Services Section */}
      <section className="product" id="SERVICES">
        <h2 className="product-category">What Brings You Here Today?</h2>
        <button className="pre-btn" onClick={() => scrollContainer('prev')}>
          <img src="/home_page/images/arrow.png" alt="prev" />
        </button>
        <button className="nxt-btn" onClick={() => scrollContainer('next')}>
          <img src="/home_page/images/arrow.png" alt="next" />
        </button>
        <div className="product-container" ref={productContainerRef}>
          <div className="product-card">
            <div className="product-image">
              <img src="/home_page/images/pic5.jpg" className="product-thumb" alt="" />
              <button className="card-btn">Join Us Today</button>
            </div>
            <div className="product-info">
              <h2 className="product-brand">In Search of a Reliable Driver?</h2>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image">
              <img src="/home_page/images/pic6.jpg" className="product-thumb" alt="" />
              <button className="card-btn">Join Us Today</button>
            </div>
            <div className="product-info">
              <h2 className="product-brand">Require a Competent Cook?</h2>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image">
              <img src="/home_page/images/pic7.jpg" className="product-thumb" alt="" />
              <button className="card-btn">Join Us Today</button>
            </div>
            <div className="product-info">
              <h2 className="product-brand">Seeking a Personal Assistant?</h2>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image">
              <img src="/home_page/images/pic8.jpg" className="product-thumb" alt="" />
              <button className="card-btn">Join Us Today</button>
            </div>
            <div className="product-info">
              <h2 className="product-brand">Require Software-related Help?</h2>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image">
              <img src="/home_page/images/pic9.jpg" className="product-thumb" alt="" />
              <button className="card-btn">Join Us Today</button>
            </div>
            <div className="product-info">
              <h2 className="product-brand">Looking for a Mechanic Nearby</h2>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image">
              <img src="/home_page/images/pic10.jpg" className="product-thumb" alt="" />
              <button className="card-btn">Join Us Today</button>
            </div>
            <div className="product-info">
              <h2 className="product-brand">In need of a Local Electrician</h2>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image">
              <img src="/home_page/images/pic11.jpg" className="product-thumb" alt="" />
              <button className="card-btn">Join Us Today</button>
            </div>
            <div className="product-info">
              <h2 className="product-brand">In search of Medical Assistance?</h2>
            </div>
          </div>
          <div className="product-card">
            <div className="product-image">
              <img src="/home_page/images/pic12.jpg" className="product-thumb" alt="" />
              <button className="card-btn">Join Us Today</button>
            </div>
            <div className="product-info">
              <h2 className="product-brand">Looking for a Professional Cleaner?</h2>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer>
        <div className="main-content">
          <div className="left box">
            <h2>About Us</h2>
            <div className="content">
              <p>Welcome to FreeToWork, Bangladesh's premier online job marketplace where your free time translates into easy earnings. Discover nearby job opportunities, earn money, and make the most of your idle moments. Whether you're a student, professional, or seeking extra income, our platform connects you with flexible jobs for financial empowerment. Join us today!</p>
              <div className="social">
                <a href="https://www.facebook.com/TANZIMBINNASIR00"><span className="fab fa-facebook-f"></span></a>
                <a href="https://www.linkedin.com/in/aninda-roy-dhruba-aa0039201/"><span className="fab fa-linkedin"></span></a>
                <a href="https://www.instagram.com/nafiztalukder/"><span class="fab fa-instagram"></span></a>
                <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"><span className="fab fa-youtube"></span></a>
              </div>
            </div>
          </div>
          <div className="center box">
            <h2>Address</h2>
            <div className="content">
              <div className="place">
                <span className="fas fa-map-marker-alt"></span>
                <span className="text"><a href="https://shorturl.at/eqzJL" style={{ textDecoration: 'none' }}>CUET, Chittagong</a></span>
              </div>
              <div className="phone">
                <span className="fas fa-phone-alt"></span>
                <span className="text">+880-1712345678</span>
              </div>
              <div className="email">
                <span className="fas fa-envelope"></span>
                <span className="text">freetowork@gmail.com</span>
              </div>
            </div>
          </div>
          <div className="right box">
            <h2>Contact Us</h2>
            <div className="content">
              <form onSubmit={handleFeedbackSubmit}>
                <div className="email">
                  <div className="text">Email *</div>
                  <input 
                    type="email" 
                    id="feedback_email" 
                    required 
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                  />
                </div>
                <div className="msg">
                  <div className="text">Message *</div>
                  <textarea 
                    name="message" 
                    cols="25" 
                    rows="2" 
                    required
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                  ></textarea>
                </div>
                <div className="btn">
                  <button type="submit">Send</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="bottom">
          <center>
            <span className="credit">Created By <a href="#">Tanzim, Nafiz, Dhrubo</a> | </span>
            <span className="far fa-copyright"></span>
            <span> 2020 All rights reserved.</span>
          </center>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
