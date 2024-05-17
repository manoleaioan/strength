import React, { useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import useOnClickOutside from "../useOnClickOutside";

import { Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import "./SearchBtn.scss";


export const SearchBtn = ({ expanded, setExpanded, setSearch, ...otherProps }) => {
  const variants = {
    hidden: {
      width: "40px",
      transition: { type: "spring", duration: 0.5, bounce: 0 }
    },
    expanded: {
      width: "100%",
      transition: { type: "spring", duration: 0.5, bounce: 0 }
    }
  }

  const ref = useRef();

  useEffect(() => {
    if (!expanded)
      setSearch("");
  }, [expanded, setSearch])

  useOnClickOutside(ref, () => setExpanded(false));

  const handleChange = event => {
    const { value } = event.target;
    setSearch(value);
  };

  return (
    <motion.div
      ref={ref}
      className="search"
      variants={variants}
      animate={expanded ? "expanded" : "hidden"}
    >
      <input
        type="text"
        disabled={!expanded}
        ref={input => input && input.focus()}
        onChange={handleChange}
        {...otherProps}
      />
      <Button className="roundbtn" onClick={() => setExpanded(!expanded)}>
        {expanded
          ? <CloseIcon />
          : <SearchIcon />
        }
      </Button>
    </motion.div>
  )
}