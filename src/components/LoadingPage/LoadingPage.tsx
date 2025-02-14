import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import "./LoadingPage.css";

// Ensure the gif file is available at the specified path.
const gifSrc = "public/loading.gif"; 

const messages = [
  "Pulling Images",
  "Setting up level",
  "Setting up containers"
];

const LoadingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.6 } }
  };

  const imgVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8 } }
  };

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="loading-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.img
        src={gifSrc}
        alt="Loading animation"
        variants={imgVariants}
        initial="initial"
        animate="animate"
        className="loading-gif"
      />
      <AnimatePresence mode="wait">
        <motion.h1
          key={index}
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {messages[index]}
        </motion.h1>
      </AnimatePresence>
    </motion.div>
  );
};

export default LoadingPage;