import React, { useCallback } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence } from "framer-motion";
import Backdrop from "./Backdrop";
import { useState, useEffect, useRef, Children } from 'react';
import useWindowDimensions from "../useWindowDimensions";
import "./index.scss";

const Modal = ({ onClose, children, open, className }) => {
  let y = useMotionValue(0);
  const opacity = useTransform(y, [0, 0, 200], [0, 1, 0]);
  const sheetRef = useRef(null);
  const controls = useAnimation();
  const { height, width } = useWindowDimensions();
  const [isVisible, setIsVisible] = useState(false);

  const dropIn = {
    hidden: {
      opacity: width >= 480 ? 0 : 1,
      y: width >= 480 ? "30%" : "100%",
      transition: { type: "spring", duration: 0.5, bounce: 0 }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", duration: 0.6, bounce: width >= 480 ? 0.3 : 0 }
    }
  };

  const close = useCallback(() => {
    if (isVisible) {
      const scrollY = document.body.style.top;
      document.body.style = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
      onClose();
      setIsVisible(false);
    }
  }, [isVisible, onClose]);

  useEffect(() => {
    controls.start("visible")
  }, [controls])

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      controls.start("visible")
    }
    else {
      close();
    }
  }, [open, controls, close])

  const header = Children.toArray(children).find(child => child.type === "header");
  const content = Children.toArray(children).filter(child => child.type !== "header");

  const onDragEnd = (event, info) => {
    if (Math.abs(info.velocity.y) >= 50 || y.get() / sheetRef.current.clientHeight > 0.35) {
      close();
    } else {
      controls.start("visible")
    }
  }

  return (
    <AnimatePresence initial={true} mode="wait">
      {open && (
        <Backdrop onClick={close}>
          <div className="fix">
            <motion.div
              className={`modal ${className}`}
              drag="y"
              onDragEnd={onDragEnd}
              dragMomentum={false}
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.2 }}
              style={{ ...(width > 480 ? { y, opacity } : { y }) }}
              ref={sheetRef}
              variants={dropIn}
              animate={controls}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="main"
                variants={dropIn}
                initial="hidden"
                animate={controls}
                exit="hidden"
              >
                {header}
                <motion.div className="content" drag="false">{content}</motion.div>
              </motion.div>
            </motion.div>
          </div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default Modal;