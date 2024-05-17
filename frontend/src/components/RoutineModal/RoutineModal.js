import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux';
import { createRoutineStart } from '../../redux/routine/routine.actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectRoutineList } from '../../redux/routine/routine.selectors';
import classNames from 'classnames';

import { Button, CircularProgress } from '@mui/material';
import { InputText } from '../../components/InputText/InputText';
import Modal from '../../components/Modal';
import ColorLensIcon from '@mui/icons-material/ColorLens';

import "./RoutineModal.scss";


const RoutineModal = ({ open, closeModal, createRoutine, routine: { routineList, error }, edit = false, editRoutine }) => {
  const [errors, setErrors] = useState({});
  const [isRoutineCreating, setIsRoutineCreating] = useState(false);
  const [colors, setColors] = useState({
    list: ['#95A5A6', '#2ECC71', '#3498DB', '#9B59B6', '#E91E63', '#F1C40F', '#E74C3C', 'violet'],
    selected: 0
  });
  const [routineData, setRoutineData] = useState({
    name: "",
    color: colors.list[colors.selected]
  })


  useEffect(() => {
    if (edit) {
      setRoutineData({
        name: editRoutine.name,
        color: editRoutine.color
      });
      let activeColor = colors.list.findIndex(i => i === editRoutine.color);
      setColors(c => ({
        ...c,
        list: [...c.list.slice(0, c.list.length - 1), editRoutine.color],
        selected: activeColor === -1 ? 7 : activeColor
      }))
    }

  }, [edit, editRoutine, open])


  const close = useCallback(() => {
    if (open) {
      setErrors({});
      closeModal();
    }
    setColors(c => ({ ...c, selected: 0 }));
    setRoutineData({
      name: "",
      color: colors.list[colors.selected]
    });
  }, [closeModal, open]);

  const handleChange = event => {
    const { name, value } = event.target;
    setRoutineData({ ...routineData, [name]: value });
  };


  useEffect(() => {
    if (open) {
      if (error) {
        setErrors({
          name: error.message.includes('duplicate key')
            ? `Routine's name in use`
            : error
        });
      } else if (isRoutineCreating) {
        close();
        setRoutineData({ color: '#ff6161', name: "" });
      }
      setIsRoutineCreating(false);
    }
  }, [error, routineList, open, close])

  const handlecreateRoutine = event => {
    event.preventDefault();

    const { name } = routineData;
    let validationErrors = {};

    if (name.trim().length < 3) {
      validationErrors.name = `name ${name.trim().length === 0 ? 'required' : 'is too short'}`;
    }

    if (Object.keys(validationErrors).length) {
      return setErrors({
        ...validationErrors,
      });
    }
    setIsRoutineCreating(true);

    if (edit) {
      createRoutine({ routineInput: { ...routineData, _id: editRoutine._id } });
    } else {
      createRoutine({ routineInput: routineData });
    }
  }

  const pickColor = (color, index) => {
    setRoutineData({ ...routineData, color });
    let newColors = colors.list;
    if (index === 7) {
      newColors[7] = color;
    }
    setColors({
      list: newColors,
      selected: index
    });
  }

  return <Modal onClose={close} open={open} className="routine">
    <header>
      {
        edit ? "Edit routine" : "Create a routine"
      }
    </header>
    <form onSubmit={handlecreateRoutine} >
      <InputText
        type="text"
        name="name"
        placeholder="name"
        onChange={handleChange}
        value={routineData.name}
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
              key={c + i}
              onClick={() => pickColor(c, i)}
            >{(i === 7) && <ColorLensIcon style={{ color: i === colors.selected ? '#00000069' : c }} />}</div>
          )
        }
        <input id="custom" type="color" value={colors.list[7]} onChange={e => pickColor(e.target.value, 7)} />
      </div>


      <div className="ctrl">
        <Button className="save" type="submit" disabled={isRoutineCreating}>
          {isRoutineCreating && <CircularProgress className="loader" />}Save</Button>
        <Button className="cancel" onClick={close} disabled={isRoutineCreating}>Cancel</Button>
      </div>
    </form>
  </Modal>
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  routine: selectRoutineList
});

const mapDispatchToProps = dispatch => ({
  createRoutine: routine => dispatch(createRoutineStart(routine))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutineModal);