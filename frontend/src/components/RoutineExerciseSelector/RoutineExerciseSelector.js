import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
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
import AddIcon from '@mui/icons-material/Add';

import "./RoutineExerciseSelector.scss";
import ExerciseModal from '../ExerciseModal/ExerciseModal';


const RoutineExerciseSelector = ({
  close, routine, routines: { deleteRoutine_res }, createRoutine,
  exercises, exercises: { isLoading }, getExercises }) => {

  const [modalExercise, setModalExerciseOpen] = useState(false);
  const [errors, setErrors] = useState();
  const [exerciseList, setExerciseList] = useState(false);
  const [selectedExercises, setSelectedExercises] = useState({});
  const [isRoutineUpdating, setIsRoutineUpdating] = useState(false);

  useEffect(() => {
    setExerciseList(exercises.exerciseList)
  }, [exercises.exerciseList]);


  useEffect(() => {
    setErrors(deleteRoutine_res);
  }, [deleteRoutine_res])

  useEffect(() => {
    if (errors) {
      alert(errors);
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
    const {chartData, ...routineData} = routine;

    createRoutine({
      routineInput: {
        ...routineData,
        exercises: [
          ...routine.exercises.map(e => (
            {
              _id: e._id,
              ...(e.exId && { exId: e.exId._id }),
              ...(e.superset?.length > 0 && {
                superset: e.superset.map(s => ({
                  _id: s._id,
                  exId: s.exId._id,
                }))
              })
            })
          ),
          ...selectedEx.map(id => ({ exId: id }))
        ]
      }
    });
  }

  return (
    routine && <div className="addex-container">
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
)(RoutineExerciseSelector);