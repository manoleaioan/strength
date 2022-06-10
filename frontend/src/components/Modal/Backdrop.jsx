import { motion } from "framer-motion";
import { useEffect } from "react";

const Backdrop = ({ children, onClick }) => {
  useEffect(() => {
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.position = 'fixed';
  }, [])

  return (<>
    <motion.div
      onClick={onClick}
      className="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
    {children}
  </>
  );
};

export default Backdrop;