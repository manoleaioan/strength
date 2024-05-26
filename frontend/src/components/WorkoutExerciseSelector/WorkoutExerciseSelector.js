import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectWorkoutList } from '../../redux/workout/workout.selectors';
import { createWorkoutStart, deleteWorkoutStart } from '../../redux/workout/workout.actions';
import { selectExerciseList } from '../../redux/exercise/exercise.selectors';
import { getExercisesStart } from '../../redux/exercise/exercise.actions';

import CloseIcon from '@mui/icons-material/Close';
import { Button, CircularProgress } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddIcon from '@mui/icons-material/Add';

import "./WorkoutExerciseSelector.scss";
import ExerciseModal from '../ExerciseModal/ExerciseModal';


const WorkoutExerciseSelector = ({
  close, workout, workouts: { deleteWorkout_res }, createWorkout,
  exercises, exercises: { isLoading }, getExercises }) => {

  const [modalExercise, setModalExerciseOpen] = useState(false);
  const [errors, setErrors] = useState();
  const [exerciseList, setExerciseList] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState({});
  const [isWorkoutUpdating, setIsWorkoutUpdating] = useState(false);

  useEffect(() => {
    setExerciseList(exercises.exerciseList)
  }, [exercises.exerciseList]);


  useEffect(() => {
    setErrors(deleteWorkout_res);
  }, [deleteWorkout_res])

  useEffect(() => {
    if (errors) {
      alert(errors);
    }
  }, [errors])


  useEffect(() => {
    if (isWorkoutUpdating) {
      close();
      setSelectedExercises({});
      setIsWorkoutUpdating(false);
    }
  }, [workout, close])

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

  const updateWorkout = () => {
    setIsWorkoutUpdating(true);
    const selectedEx = Object.keys(selectedExercises).filter(i => selectedExercises[i] === true);
    createWorkout({
      workoutInput: {
        ...workout,
        exercises: [...workout.exercises, ...selectedEx.map(id => ({ exId: {_id: id} }))]
        // exercises: [
        //   ...workout.exercises.map(e => ({
        //     _id: e._id,
        //     ...(e.exId && e.exId),
        //     ...(e.superset?.length > 0 && {
        //       superset: e.superset.map(s => s)
        //     })
        //   })),
        //   ...selectedEx.map(id => ({ exId: { _id: id, ...id } }))
        // ]
      }
    });
  }

  return (
    workout && <div className="addex-container">
      <div className="header">
        <div id="title">
          <Button className="btn-back" onClick={close}><ArrowBackIosIcon /></Button>
          <h1 style={{ color: workout.color }}> Add Exercise</h1>
        </div>

        {
          Object.values(selectedExercises).filter(v => v === true).length > 0 ?
            <div className="btns">
              <Button className="cancel-ex-btn" onClick={() => setSelectedExercises({})}><CloseIcon /></Button>
              <Button className="add-ex-btn" onClick={updateWorkout} style={{ backgroundColor: workout.color }}>
                {isWorkoutUpdating
                  ? <CircularProgress className="loader" />
                  : "Add" + Object.values(selectedExercises).filter(v => v === true).length}
              </Button>
            </div>
            :
            <div className="btns">
              <Button className="roundbtn create-ex-btn" onClick={() => setModalExerciseOpen(true)} style={{ backgroundColor: workout.color }}>
                <AddIcon />
              </Button>
            </div>
        }
      </div>

      <ExerciseModal open={modalExercise} closeModal={() => setModalExerciseOpen(false)} />

      <div className="content">
        <div className="exercises-list">
          {isLoading && [1, 2, 3].map(i => <div className="exercise skeleton" key={i}></div>)}
          {
            exerciseList && exerciseList
              .map(ex =>
                <div
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
                </div>
              ).reverse()
          }
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  workouts: selectWorkoutList,
  exercises: selectExerciseList
});


const mapDispatchToProps = dispatch => ({
  getExercises: () => dispatch(getExercisesStart()),
  createWorkout: workout => dispatch(createWorkoutStart(workout)),
  deleteWorkout: (workoutId, routineId) => dispatch(deleteWorkoutStart(workoutId, routineId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkoutExerciseSelector);