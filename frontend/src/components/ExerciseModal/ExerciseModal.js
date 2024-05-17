import React, { useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux';
import { createExerciseStart } from '../../redux/exercise/exercise.actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectExerciseList } from '../../redux/exercise/exercise.selectors';
import classNames from 'classnames';

import { Button, CircularProgress } from '@mui/material';
import { InputText } from '../../components/InputText/InputText';
import Modal from '../../components/Modal';
import TimerIcon from '@mui/icons-material/Timer';
import ImportExportIcon from '@mui/icons-material/ImportExport';

import "./ExerciseModal.scss";

const ExerciseModal = ({ open, closeModal, createExercise, exercise: { exerciseList, error }, edit = false, editEx }) => {
  const [errors, setErrors] = useState({});
  const [isExerciseCreating, setExerciseCreating] = useState(false);
  const [exerciseData, setExerciseData] = useState({
    name: "",
    type: 0
  })

  useEffect(() => {
    if (edit) {
      setExerciseData({
        name: editEx.name,
        type: editEx.type
      });
    }

  }, [edit, editEx, open])

  const close = useCallback(() => {
    if (open) {
      setErrors({})
      closeModal()
    }
  }, [closeModal, open]);

  const handleChange = event => {
    const { name, value } = event.target;
    setExerciseData({ ...exerciseData, [name]: value });
  };

  useEffect(() => {
    if (open) {
      if (error) {
        setErrors({
          name: error.message.includes('duplicate key')
            ? 'Exercise Name in use'
            : error
        });
      } else if (isExerciseCreating) {
        setExerciseData({ type: 0, name: "" });
        close();
      }
      setExerciseCreating(false);
    }
  }, [error, exerciseList, open, close])

  const handleCreateExercise = event => {
    event.preventDefault();

    const { name } = exerciseData;
    let validationErrors = {};

    if (name.trim().length < 3) {
      validationErrors.name = `name ${name.trim().length === 0 ? 'required' : 'is too short'}`;
    }

    if (Object.keys(validationErrors).length) {
      return setErrors({
        ...validationErrors,
      });
    }

    setExerciseCreating(true);

    if (edit) {
      createExercise({ exerciseInput: { ...exerciseData, _id: editEx._id } });
    } else {
      createExercise({ exerciseInput: exerciseData });
    }
  }

 
  return <Modal onClose={close} open={open} >
    <header>
      {
        edit ? "Edit exercise" : "Add an exercise"
      }
    </header>
    <form onSubmit={handleCreateExercise} >
      <InputText
        type="text"
        name="name"
        placeholder="name"
        onChange={handleChange}
        value={exerciseData.name}
        error={errors.name}
        autoComplete="nope"
      />
      <div className="type">
        <p>Type / </p>
        <Button
          className={classNames("reps", { "active": exerciseData.type === 0 })}
          onClick={() => setExerciseData({ ...exerciseData, type: 0 })}>
          <ImportExportIcon /> Reps
        </Button>
        <Button
          className={classNames("iso", { "active": exerciseData.type === 1 })}
          onClick={() => setExerciseData({ ...exerciseData, type: 1 })}>
          <TimerIcon /> Time
        </Button>
      </div>

      <div className="ctrl">
        <Button className="save" type="submit" disabled={isExerciseCreating}>
          {isExerciseCreating && <CircularProgress className="loader" />} Save</Button>
        <Button className="cancel" onClick={close} disabled={isExerciseCreating}>Cancel</Button>
      </div>
    </form>
  </Modal>
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  exercise: selectExerciseList
});

const mapDispatchToProps = dispatch => ({
  createExercise: exercise => dispatch(createExerciseStart(exercise))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExerciseModal);