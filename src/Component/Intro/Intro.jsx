import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { FaCar, FaTools } from "react-icons/fa";
import './Intro.css';
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const navigate = useNavigate();
  return (
    <Box className="intro-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="content"
      >
        <h1 className="title">
        Ranwaka Car Audio <br /> & <br /> <span> ALL Accessories</span> 
        </h1>
          
        
        <Typography variant="h6" className="subtitle">
          Premium Car Audio Systems | Accessories | Professional Installations
        </Typography>
        <Box className="icons">
          <FaCar className="icon" />
          <FaTools className="icon" />
        </Box>
        <button variant="contained" className="explore-btn" onClick={()=>navigate('/login')}>
          Login 
        </button>
      </motion.div>
    </Box>
  );
};

export default Intro;