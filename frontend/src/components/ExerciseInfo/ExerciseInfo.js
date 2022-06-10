import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectExerciseList } from '../../redux/exercise/exercise.selectors';
import { deleteExerciseStart } from '../../redux/exercise/exercise.actions';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button, CircularProgress } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ExerciseModal from '../ExerciseModal/ExerciseModal';
import Modal from '../../components/Modal';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import "./ExerciseInfo.scss";


const ExerciseInfo = ({ exercise, close, deleteExercise, exercises: { deleteExercise_res } }) => {
  const { name, type, _id } = exercise || {};
  const [openOptions, setOpenOptions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [modal, setModalOpen] = useState(false);
  const [deleteConfirmation, setdeleteConfirmation] = useState(false);
  const [isExerciseDeleting, setIsExerciseDeleting] = useState(false);
  const [errors, setErrors] = useState();

  const confirmDeletion = () => {
    setIsExerciseDeleting(true);
    deleteExercise({ exerciseId: _id });
  }

  useEffect(() => {
    setErrors(deleteExercise_res);
  }, [deleteExercise_res])

  useEffect(() => {
    if (errors) {
      alert(errors);
      setIsExerciseDeleting(false);
    }
  }, [errors])
  

  useEffect(() => {
    setErrors();
  }, []);

  return (
    exercise ? <motion.div
      layoutId={_id}
      transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
      animate={{ opacity: 1 }}
      className="exerciseInfo-container">

      <div className="header">
        <motion.div id="title">
          <Button className="btn-back" onClick={close}><ArrowBackIosIcon /></Button>
          <h1> {name}</h1>

          {/* <span className="underline"></span> */}
        </motion.div>

        <div className="btns">
          <Button className="edit-exercise" onClick={(e) => {
            setOpenOptions(true);
            setAnchorEl(e.currentTarget)
          }}><MoreVertIcon />
          </Button>

          <Menu
            className="optionsMenu"
            anchorEl={anchorEl}
            open={openOptions}
            onClose={() => { setAnchorEl(null); setOpenOptions(false) }}
          >
            <MenuItem onClick={() => {
              setModalOpen(true)
              setOpenOptions(false)
            }}><EditIcon/>Edit</MenuItem>

            <MenuItem onClick={() => {
              setOpenOptions(false)
              setdeleteConfirmation(true)
            }}><DeleteIcon/>Delete</MenuItem>
          </Menu>
        </div>
      </div>

      <ExerciseModal editEx={exercise} open={modal} closeModal={() => setModalOpen(false)} edit={true} />

      <Modal className="modalDelEx" onClose={() => setdeleteConfirmation(false)} open={deleteConfirmation} >
        <header>
          {`Deleting ${name}`}
        </header>

        <div className="info">
          <InfoOutlinedIcon />
          Do you really want to delete this exercise?
          This action cannot be undone.
        </div>

        <div className="ctrl">
          <Button className="del" type="submit" disabled={isExerciseDeleting} onClick={confirmDeletion}>
            {isExerciseDeleting && <CircularProgress className="loader" />}DELETE
          </Button>
          <Button className="cancel" onClick={() => setdeleteConfirmation(false)} disabled={isExerciseDeleting}>Cancel</Button>
        </div>

      </Modal>

      <motion.div
        className="content"
      >
        <div>
          <button onClick={close}>Go Back</button>
        </div>
      </motion.div>

    </motion.div> :<></>
  )
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  exercises: selectExerciseList
});


const mapDispatchToProps = dispatch => ({
  deleteExercise: exerciseId => dispatch(deleteExerciseStart(exerciseId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExerciseInfo);