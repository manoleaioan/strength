import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { motion } from "framer-motion";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectRoutineList } from '../../redux/routine/routine.selectors';
import { createRoutineStart, deleteRoutineStart } from '../../redux/routine/routine.actions';
import { selectExerciseList } from '../../redux/exercise/exercise.selectors';
import { getExercisesStart } from '../../redux/exercise/exercise.actions';

import CloseIcon from '@mui/icons-material/Close';
import { Button, CircularProgress } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import RoutineModal from '../RoutineModal/RoutineModal';
import Modal from '../Modal';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';

import "./AddExercises.scss";
import ExerciseModal from '../ExerciseModal/ExerciseModal';


const AddExercises = ({ close,
  routine, deleteRoutine, routines: { deleteRoutine_res }, createRoutine,
  exercises, exercises: { isLoading }, getExercises }) => {

  const { name, type, _id } = routine || {};
  const [modal, setModalOpen] = useState(false);
  const [modalExercise, setModalExerciseOpen] = useState(false);
  const [deleteConfirmation, setdeleteConfirmation] = useState(false);
  const [isRoutineDeleting, setisRoutineDeleting] = useState(false);
  const [errors, setErrors] = useState();
  const [exerciseList, setExerciseList] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState({});
  const [isRoutineUpdating, setIsRoutineUpdating] = useState(false);

  useEffect(() => {
    setExerciseList(exercises.exerciseList)
  }, [exercises.exerciseList]);

  const confirmDeletion = () => {
    setisRoutineDeleting(true);
    deleteRoutine({ routineId: _id });
  }

  useEffect(() => {
    setErrors(deleteRoutine_res);
  }, [deleteRoutine_res])

  useEffect(() => {
    if (errors) {
      alert(errors);
      setisRoutineDeleting(false);
    }
  }, [errors])


  useEffect(() => {
    if (isRoutineUpdating) {
      close();
      setSelectedExercises({});
      setIsRoutineUpdating(false);
    }
  }, [routine, close])

  useEffect(() => {
    if (!exercises.exerciseList) {
      setTimeout(getExercises, 0);
    }
  }, [exercises.exerciseList, getExercises]);

  useEffect(() => {
    setErrors();
  }, []);

  const selectExercise = (ex) => {
    setSelectedExercises(e => ({ ...e, [ex._id]: !selectedExercises[ex._id] }))
  }

  const updateRoutine = () => {
    setIsRoutineUpdating(true);
    const selectedEx = Object.keys(selectedExercises).filter(i => selectedExercises[i] === true);
    createRoutine({
      routineInput: {
        ...routine,
        exercises: [
          ...routine.exercises.map(e => { 
            return {
              _id: e._id,
              ...(e.exId && { exId: e.exId._id }),
              ...(e.superset?.length > 0 && {
                superset: e.superset.map(s => {
                  return {
                    _id: s._id,
                    exId: s.exId._id,
                  }
                })
              })
            }
          }),
          ...selectedEx.map(id => { return { exId: id } })
        ]
      }
    });
  }

  return (
    routine && <div
      // initial={{ x: 100 }}
      // animate={{ x: 0 }}
      // transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
      // exit={{ x: 100 }}
      className="addex-container">

      <div className="header">
        <div id="title">
          <Button className="btn-back" onClick={close}><ArrowBackIosIcon /></Button>
          <h1 style={{ color: routine.color }}> Add Exercise</h1>
        </div>

        {
          Object.values(selectedExercises).filter(v => v === true).length > 0 ?
            <div className="btns">
              <Button className="cancel-ex-btn" onClick={() => setSelectedExercises({})}><CloseIcon /></Button>
              <Button className="add-ex-btn" onClick={updateRoutine} style={{ backgroundColor: routine.color }}>
                {isRoutineUpdating
                  ? <CircularProgress className="loader" />
                  : "Add" + Object.values(selectedExercises).filter(v => v === true).length}
              </Button>
            </div>
            :
            <div className="btns">
              <Button className="roundbtn create-ex-btn" onClick={() => setModalExerciseOpen(true)} style={{ backgroundColor: routine.color }}>
                <AddIcon />
              </Button>
            </div>
        }
      </div>

      <ExerciseModal open={modalExercise} closeModal={() => setModalExerciseOpen(false)} />

      <RoutineModal editRoutine={routine} open={modal} closeModal={() => setModalOpen(false)} edit={true} />

      <Modal className="modalDelEx" onClose={() => setdeleteConfirmation(false)} open={deleteConfirmation} >
        <header>
          {`Deleting ${name}`}
        </header>

        <div className="info">
          <InfoOutlinedIcon />
          Do you really want to delete this routine?
          This action cannot be undone.
        </div>

        <div className="ctrl">
          <Button className="del" type="submit" disabled={isRoutineDeleting} onClick={confirmDeletion}>
            {isRoutineDeleting && <CircularProgress className="loader" />}DELETE
          </Button>
          <Button className="cancel" onClick={() => setdeleteConfirmation(false)} disabled={isRoutineDeleting}>Cancel</Button>
        </div>
      </Modal>

      {/* <AddExercises close={() => setSelectExModal(false)} /> */}

      <motion.div
        className="content"
      >
        <div className="exercises-list">
          {isLoading && [1, 2, 3].map(i => <div className="exercise skeleton" key={i}></div>)}
          {
            exerciseList && exerciseList
              // .filter(ex =>!routine.exercises.find(e => e._id === ex._id))
              .map(ex =>
                <motion.div
                  className={classNames('exercise', {
                    selected: selectedExercises[ex._id]
                  })}
                  onClick={() => selectExercise(ex)}
                  key={ex._id}
                >
                  <div className="title">
                    <h1>{ex.name} </h1>
                    {/* <div className="info">{ex.type === 0 ? 'RM/VOL' : 'Max ISO/VOL'}<span>{ex.maxRep}</span> / <span>{ex.maxVol}</span></div> */}
                  </div>
                </motion.div>
              ).reverse()
          }
        </div>
      </motion.div>

    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  routines: selectRoutineList,
  exercises: selectExerciseList
});


const mapDispatchToProps = dispatch => ({
  getExercises: () => dispatch(getExercisesStart()),
  createRoutine: routine => dispatch(createRoutineStart(routine)),
  deleteRoutine: routineId => dispatch(deleteRoutineStart(routineId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddExercises);