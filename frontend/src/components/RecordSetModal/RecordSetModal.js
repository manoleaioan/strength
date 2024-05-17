import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux';
import { createWorkoutStart } from '../../redux/workout/workout.actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectWorkoutList } from '../../redux/workout/workout.selectors';
import classNames from 'classnames';

import { Button, LinearProgress } from '@mui/material';
import Modal from '../Modal';

import "./RecordSetModal.scss";
import { getRoutinesStart } from '../../redux/routine/routine.actions';
import { selectRoutineList } from '../../redux/routine/routine.selectors';
import { Delete } from '@mui/icons-material';


const RecordSetModal = ({ exercise, closeModal, createWorkout, workout: { workoutList, error }, editWorkout, editExercise, onWorkoutCreated, startDate, routines: { routineList }, getRoutines, copyWorkoutCallback }) => {
  const [errors, setErrors] = useState({});
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [rep, setRep] = useState(5);
  const [weight, setWeight] = useState(0);


  const close = useCallback(() => {
    if (exercise) {
      setErrors({});
      closeModal();
      setIsModalLoading(false);
    }
  }, [closeModal, exercise]);


  useEffect(() => {
    if (routineList) {
      setIsModalLoading(false);
    }
  }, [routineList])


  useEffect(() => {
    if (exercise.edit) {
      setRep(r => exercise.record || 5);
      setWeight(w => exercise.weight || 0)
    } else {
      setRep(5);
      setWeight(0)
    }
  }, [exercise.record, exercise.weight, exercise.edit])

  const onWorkoutCreatedCallback = (response) => {
    setIsModalLoading(false);
    close();
    // onWorkoutCreated(response);
  }

  const handleCreateWorkout = async (deleteRecord) => {
    
    let updateExercises = editWorkout.exercises.map(e => {
      if (e._id == exercise._id) {
        if (!e.records) {
          e.records = [];
        }
        if (deleteRecord) {
          e.records.splice(exercise.setNr, 1);
        } else if (exercise.edit) {
          e.records[exercise.setNr] = {
            record: rep,
            weight
          };
        } else {
          e.records.push({
            record: rep,
            weight
          });
        }

        return e;
      } else if (e.superset?.length > 0) {
        e.superset.map(subEx => {
          if (subEx._id == exercise._id) {
            if (!subEx.records) {
              subEx.records = [];
            }

            if (deleteRecord) {
              subEx.records.splice(exercise.setNr, 1);
            } else if (exercise.edit) {
              subEx.records[exercise.setNr] = {
                record: rep,
                weight
              };
            } else {
              subEx.records.push({
                record: rep,
                weight
              });
            }

            return subEx;
          }
        });
      }
      return e;
    });

    setIsModalLoading(true);

    createWorkout({
      workoutInput: {
        ...editWorkout,
        exercises: updateExercises,
        exerciseRecordUpdated: {
          _id: !deleteRecord ? exercise._id : null,
          time: new Date().toISOString()
        }
      }
    },
      onWorkoutCreatedCallback);
  }

  return <Modal onClose={close} open={exercise}
    className={classNames('record-set-modal', {
      'disable': isModalLoading,
    })}>
    <header>
      {exercise.exId?.name}
      {isModalLoading && <div className="loader">
        <LinearProgress />
      </div>
      }
    </header>

    <div className="top">
      {/* <h3>{exercise.name}</h3> */}
      <h4>Set #{exercise.setNr + 1}</h4>
    </div>

    <div className="reps-weight">
      <div className="reps">
        <div className="sub">
          <span className='sign'>-</span>
          <Button onClick={() => setRep(r => r > 0 ? (r - 1) : 0)} style={{ background: editWorkout.color + '20', borderColor: editWorkout.color + '10', boxShadow: `0px 5px 5px 0px ${editWorkout.color}10` }}>1</Button>
          <Button onClick={() => setRep(r => r > 5 ? (r - 5) : 0)} style={{ color: '#fff', background: editWorkout.color + "d9", borderColor: editWorkout.color + '30', boxShadow: `0px 5px 5px 0px ${editWorkout.color}20` }}>5</Button>
        </div>
        <div className="rep">
          <span>
            {rep}
          </span>
          {exercise.exId?.type == '1' ? "sec" : "rep"}
        </div>
        <div className="add">
          <Button onClick={() => setRep(r => r < 1000 ? r + 5 : r)} style={{ color: '#fff', background: editWorkout.color + "d9", borderColor: editWorkout.color + '30', boxShadow: `0px 5px 5px 0px ${editWorkout.color}20` }}>5</Button>
          <Button onClick={() => setRep(r => r < 1000 ? r + 1 : r)} style={{ background: editWorkout.color + '20', borderColor: editWorkout.color + '10', boxShadow: `0px 5px 5px 0px ${editWorkout.color}10` }}>1</Button>
          <span className='sign'>+</span>
        </div>
      </div>

      <div className="weight">
        <div className="sub">
          <span className='sign'>-</span>
          <Button className='1' onClick={() => setWeight(w => w > 0 ? w - 1 : 0)}>1</Button>
          <Button onClick={() => setWeight(w => w > 5 ? w - 5 : 0)}>5</Button>
        </div>
        <div className="rep">
          <span>
            {weight}
          </span>
          kg
        </div>
        <div className="add">
          <Button onClick={() => setWeight(w => w < 1000 ? w + 5 : w)}>5</Button>
          <Button onClick={() => setWeight(w => w < 1000 ? w + 1 : w)}>1</Button>
          <span className='sign'>+</span>
        </div>
      </div>
    </div>

    <div className="ctrl">
      <Button className="save" onClick={() => handleCreateWorkout()} disabled={isModalLoading} style={{ background: editWorkout.color }}>{exercise.edit ? 'Update Set' : 'Record Set'}</Button>
      {exercise.edit && <Button className="delete" onClick={() => handleCreateWorkout(true)} disabled={isModalLoading.current}><Delete /></Button>}
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
)(RecordSetModal);