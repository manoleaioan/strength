import React, { useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux';
import { createWorkoutStart } from '../../redux/workout/workout.actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectWorkoutList } from '../../redux/workout/workout.selectors';
import classNames from 'classnames';
import { motion } from "framer-motion";

import { Button, CircularProgress, LinearProgress } from '@mui/material';
import Modal from '../Modal';

import "./CreateWorkoutModal.scss";
import { Add, AddBox, Article, ContentCopy } from '@mui/icons-material';
import { getRoutinesStart } from '../../redux/routine/routine.actions';
import { selectRoutineList } from '../../redux/routine/routine.selectors';
import { useNavigate } from "react-router-dom";

const CreateWorkoutModal = ({ open, closeModal, createWorkout, workout: { workoutList, error }, edit = false, editWorkout, onWorkoutCreated, startDate, routines: { routineList }, getRoutines, copyWorkoutCallback }) => {
  const [errors, setErrors] = useState({});
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [selectRoutine, setSelecRoutine] = useState(false);

  const close = useCallback(() => {
    if (open) {
      setErrors({});
      closeModal();
      setIsModalLoading(false);
      setSelecRoutine(false);
    }
  }, [closeModal, open]);


  useEffect(() => {
    if (routineList) {
      setIsModalLoading(false);
    }
  }, [routineList])


  const onWorkoutCreatedCallback = (response) => {
    setIsModalLoading(false);
    setSelecRoutine(false);
    onWorkoutCreated(response);
  }

  const handleCreateWorkout = async (type) => {
    if (type === 'on-the-fly') {
      const workout = {
        name: 'Untitled Workout',
        color: '#95A5A6',
        startDate: startDate
      }
      setIsModalLoading(true);
      createWorkout({ workoutInput: workout }, onWorkoutCreatedCallback);
    }

    if (type === 'routine-select') {
      if (!routineList) {
        setIsModalLoading(true);
        getRoutines();
      }
      setSelecRoutine(true);
    }

    if (type === 'copy-log') {
      close();
      copyWorkoutCallback();
    }
  }

  const handleRoutineSelect = (routine) => {
    setIsModalLoading(true);
    createWorkout({ workoutInput: { routineId: routine._id, startDate: startDate } }, onWorkoutCreatedCallback);
  }

  return <Modal onClose={close} open={open}
    className={classNames('workout-modal', {
      'disable': isModalLoading,
    })}>
    <header>
      Start workout
      {isModalLoading && <div className="loader">
        <LinearProgress />
      </div>
      }
    </header>

    {
      (selectRoutine && routineList) ? <motion.div className='routine-select-container' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="gradient-overlay top"></div>
        <div className='routine-select'>
          {
            routineList.map(routine =>
              <div className='routine' key={routine._id}
                style={{
                  backgroundColor: routine.color + "22",
                  borderColor: routine.color + "20",
                }}
              >
                <div className="title">
                  <h3 style={{ color: routine.color }}>{routine.name}</h3>
                  <div className="info">
                    <p>
                      {routine.exercises?.reduce((acc, e) => acc + (e?.superset ? e.superset.length : 1), 0)}
                      <span>Exercise{routine.exercises?.length !== 1 && "s"}</span>
                    </p>
                    {
                      routine.exercises?.some(e => e?.superset?.length > 0) && (
                        <p>
                          {
                            " | " + routine.exercises.filter(e => e?.superset?.length > 0).length
                          }
                          <span>Superset{routine.exercises?.filter(e => e?.superset?.length > 0).length !== 1 && "s"}</span>
                        </p>
                      )
                    }
                  </div>
                </div>
                <div className="select" style={{ background: routine.color, boxShadow: `0px 6px 19px 0px ${routine.color}30` }} onClick={() => handleRoutineSelect(routine)}>
                  Select
                </div>
              </div>
            )
          }
          {routineList.length === 0 && <div className='no-routine'>
            <p>You don't have any routines yet!</p>
            <Button onClick={() => document.getElementsByClassName('li-routines')[0]?.click()}>Go to Routines</Button>
          </div>}
        </div>
        <div className="gradient-overlay"></div></motion.div>
        :
        <div className='wk-options'>
          <div className="opt" onClick={() => handleCreateWorkout('on-the-fly')}>
            <Add />
            <div>
              <div className="title">New workout log</div>
              <p>Add exercises on the fly</p>
            </div>

            {/* {isModalLoading.current &&
         <div className='loader'>
          <CircularProgress />
         </div>
        } */}
          </div>

          <div className="opt" onClick={() => handleCreateWorkout('routine-select')}>
            <Article />
            <div>
              <div className="title">Select routine</div>
              <p>Create workout log based on a routine</p>
            </div>
          </div>

          <div className="opt" onClick={() => handleCreateWorkout('copy-log')}>
            <ContentCopy />
            <div>
              <div className="title">Copy workout log</div>
              <p>Create a complete copy of a previous workout</p>
            </div>
          </div>
        </div>
    }


    <div className="ctrl">
      <Button className="cancel" onClick={close} disabled={isModalLoading.current}>Close</Button>
    </div>
  </Modal>
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  workout: selectWorkoutList,
  routines: selectRoutineList
});

const mapDispatchToProps = dispatch => ({
  createWorkout: (workout, callback) => dispatch(createWorkoutStart(workout, callback)),
  getRoutines: () => dispatch(getRoutinesStart())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWorkoutModal);