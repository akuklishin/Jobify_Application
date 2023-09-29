import React from "react";
import styled from "styled-components"; //import from stled module
import Wrapper from "../assets/wrappers/LandingPage"; // import css wrapper
import main from "../assets/images/main.svg"; //import logo
import { Logo } from "../components";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        {/* info */}
        <div className="info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <h4 style={{ marginTop: 30, marginBottom: 30 }}>
            Make your job search easier
          </h4>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn">
            Login / Demo User
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
