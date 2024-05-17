import React, { useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux';
import { createWorkoutStart } from '../../redux/workout/workout.actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectWorkoutList } from '../../redux/workout/workout.selectors';
import classNames from 'classnames';

import { Button, CircularProgress } from '@mui/material';
import { InputText } from '../InputText/InputText';
import Modal from '../Modal';
import ColorLensIcon from '@mui/icons-material/ColorLens';

import "./WorkoutEditModal.scss";


const WorkoutEditModal = ({ open, closeModal, createWorkout, workout: { workoutList, error }, edit = false, editWorkout }) => {
  const [errors, setErrors] = useState({});
  const [isWorkoutCreating, setIsWorkoutCreating] = useState(false);
  const [colors, setColors] = useState({
    list: ['#95A5A6', '#2ECC71', '#3498DB', '#9B59B6', '#E91E63', '#F1C40F', '#E74C3C', 'violet'],
    selected: 0
  });
  const [workoutData, setWorkoutData] = useState({
    name: "",
    color: colors.list[colors.selected]
  })


  useEffect(() => {
    if (edit) {
      setWorkoutData({
        name: editWorkout.name,
        color: editWorkout.color
      });
      let activeColor = colors.list.findIndex(i => i === editWorkout.color);
      setColors(c => ({
        ...c,
        list: [...c.list.slice(0, c.list.length - 1), editWorkout.color],
        selected: activeColor === -1 ? 7 : activeColor
      }))
    }

  }, [edit, editWorkout,open])

  const close = useCallback(() => {
    if (open) {
      setErrors({})
      closeModal()
    }
  }, [closeModal, open]);

  const handleChange = event => {
    const { name, value } = event.target;
    setWorkoutData({ ...workoutData, [name]: value });
  };


  useEffect(() => {
    if (open) {
      if (error) {
        setErrors({
          name: error.message.includes('duplicate key')
            ? `Workout's name in use`
            : error
        });
      } else if (isWorkoutCreating) {
        close();
        setWorkoutData({ color: '#ff6161', name: "" });
      }
      setIsWorkoutCreating(false);
    }
  }, [error, workoutList, open, close])

  const handlecreateWorkout = event => {
    event.preventDefault();

    const { name } = workoutData;
    let validationErrors = {};

    if (name.trim().length < 3) {
      validationErrors.name = `name ${name.trim().length === 0 ? 'required' : 'is too short'}`;
    }

    if (Object.keys(validationErrors).length) {
      return setErrors({
        ...validationErrors,
      });
    }

    setIsWorkoutCreating(true);
    
    if (edit) {
      createWorkout({ workoutInput: { ...workoutData, _id: editWorkout._id } });
    } else {
      createWorkout({ workoutInput: workoutData });
    }
  }

  const pickColor = (color, index) => {
    setWorkoutData({ ...workoutData, color });
    let newColors = colors.list;
    if (index === 7) {
      newColors[7] = color;
    }
    setColors({
      list: newColors,
      selected: index
    });
  }

  return <Modal onClose={close} open={open} className="workout">
    <header>
      {
        edit ? "Edit workout" : "Create a workout"
      }
    </header>
    <form onSubmit={handlecreateWorkout} >
      <InputText
        type="text"
        name="name"
        placeholder="name"
        onChange={handleChange}
        value={workoutData.name}
        error={errors.name}
        autoComplete="nope"
      />

      <div className='slider'>
        <p>Color</p>
        {
          colors.list.map((c, i) =>
            <div
              className={
                classNames('color', { active: i === colors.selected })
              }
              style={{
                background: i === colors.selected ? c : '',
                borderColor: c
              }}
              key={c+i}
              onClick={() => pickColor(c, i)}
            >{(i === 7) && <ColorLensIcon style={{ color: i === colors.selected ? '#00000069' : c }} />}</div>
          )
        }
        <input id="custom" type="color" value={colors.list[7]} onChange={e => pickColor(e.target.value, 7)} />
      </div>


      <div className="ctrl">
        <Button className="save" type="submit" disabled={isWorkoutCreating}>
          {isWorkoutCreating && <CircularProgress className="loader" />}Save</Button>
        <Button className="cancel" onClick={close} disabled={isWorkoutCreating}>Cancel</Button>
      </div>
    </form>
  </Modal>
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  workout: selectWorkoutList
});

const mapDispatchToProps = dispatch => ({
  createWorkout: workout => dispatch(createWorkoutStart(workout))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkoutEditModal);