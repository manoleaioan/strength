import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectRoutineList } from '../../redux/routine/routine.selectors';
import { deleteRoutineStart, createRoutineStart } from '../../redux/routine/routine.actions';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button, CircularProgress } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import RoutineModal from '../RoutineModal/RoutineModal';
import Modal from '../Modal';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RoutineExerciseSelector from '../RoutineExerciseSelector/RoutineExerciseSelector';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { removeExerciseFromSuperset, setSupersetWithTheNext } from "../../helpers/exerciseUtils";

import "./RoutineInfo.scss";
import { Whatshot } from '@mui/icons-material';


const supersetIndex = (exerciseList, id) => {
  let _index = 0;
  for (let i = 0; i < exerciseList.length; i++) {
    if (exerciseList[i].superset?.length > 0) {
      _index++;
      if (exerciseList[i]._id === id) break;
    }
  }
  return _index;
}

const Exercise = (props) => {
  const dragControls = useDragControls();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openOptions, setOpenOptions] = useState(false);
  const { ex, onDragEnd, option, deleteExercise, setSuperset, setExerciseList, removeExFromSuperset, exerciseList, maincolor, supersetId, index } = props;

  const superSetNr = ex.superset && supersetIndex(exerciseList, ex._id)

  return (
    <Reorder.Item
      layout="position"
      layoutId={ex._id}
      value={ex}
      style={{
        touchAction: option === 'reorder' ? 'none' : 'unset',
        pointerEvents: option === 'reorder' ? 'none' : 'unset',
        position: "relative",
      }}
      dragListener={false}
      dragControls={dragControls}
      className={ex.superset?.length > 0 ? 'exercise superset' : 'exercise'}
      onDragEnd={onDragEnd}
      transition={{
        type: "spring",
        duration: 0.5,
        bounce: 0
      }}
    >
      {
        ex.superset?.length > 0
          ?
          <Reorder.Group
            dragControls={dragControls}
            values={ex.superset}
            axis="y"
            onReorder={(exs) => {
              setExerciseList(
                exerciseList.map((e) => {
                  if (e.superset && e._id === ex._id) e.superset = exs;
                  return e;
                })
              );
            }}
          >
            <motion.div
              className="heading"
              style={{
                borderBottom: `1px solid ${maincolor}`,
                color: maincolor
              }}>
              Superset {superSetNr}
              {option === 'reorder' &&
                <div className="drag" onPointerDown={(e) => dragControls.start(e)}>
                  <DragIndicatorIcon />
                </div>}
            </motion.div>
            {
              ex.superset.map(e => <Exercise
                layout="position"
                option={option}
                onDragEnd={onDragEnd}
                ex={e}
                key={e._id}
                deleteExercise={deleteExercise}
                supersetId={ex._id}
                setSuperset={setSuperset}
                removeExFromSuperset={removeExFromSuperset}
                index={index} />)
            }
          </Reorder.Group>
          : ex.exId && <>
            <motion.div
              className="title">
              <h1>{ex.exId.name}</h1>
              {/* <div className="info">{ex.type === 0 ? 'RM/VOL' : 'Max ISO/VOL'}<span>{ex.maxRep}</span> / <span>{ex.maxVol}</span></div> */}
            </motion.div>

            {option === 'reorder' ?
              <div className="drag" onPointerDown={(e) => dragControls.start(e)}>
                <DragIndicatorIcon />
              </div>
              :
              <Button className="edit-ex" onClick={(e) => {
                setOpenOptions(true);
                setAnchorEl(e.currentTarget)
              }}><MoreVertIcon />
              </Button>
            }

            <Menu
              className="options-menu-ex"
              anchorEl={anchorEl}
              open={openOptions}
              onClose={() => {
                setAnchorEl(null);
                setOpenOptions(false)
              }}
            >
              <MenuItem onClick={() => {
                setOpenOptions(false)
                setSuperset(ex._id, supersetId, index)
              }}><InsertLinkIcon />Superset with the next</MenuItem>

              {
                supersetId &&
                <MenuItem onClick={() => {
                  setOpenOptions(false)
                  removeExFromSuperset({ ...ex, supersetId })
                }}><LinkOffIcon />Remove from superset</MenuItem>
              }

              <MenuItem onClick={() => {
                setOpenOptions(false)
                deleteExercise({ title: ex.exId.name, field: 'exercise', id: ex._id, supersetId })
              }}><DeleteIcon />Delete</MenuItem>
            </Menu>
          </>
      }
    </Reorder.Item>
  );
}

const ConfirmDeletionModal = ({ deleteConfirmation, onClose, isRoutineDeleting, confirmExerciseDeletion, confirmRoutineDeletion }) => <Modal
  className="modal-del-ex"
  onClose={onClose}
  open={deleteConfirmation.field}
>
  <header>
    {`Deleting ${deleteConfirmation.title}`}
  </header>

  <div className="info">
    <InfoOutlinedIcon />
    Do you really want to delete this {deleteConfirmation.field === 'routine' ? 'routine' : 'exercise'}?
    This action cannot be undone.
  </div>

  <div className="ctrl">
    <Button className="del" type="submit" disabled={isRoutineDeleting}
      onClick={deleteConfirmation.field === 'routine' ? confirmRoutineDeletion
        : () => confirmExerciseDeletion(deleteConfirmation.id, deleteConfirmation.supersetId)}>
      {isRoutineDeleting && <CircularProgress className="loader" />}DELETE
    </Button>
    <Button className="cancel" onClick={onClose} disabled={isRoutineDeleting}>Cancel</Button>
  </div>
</Modal>

const RoutineInfo = ({ createRoutine, routine, close, deleteRoutine, routines: { deleteRoutine_res } }) => {
  const { name, type, _id } = routine || {};
  const [openOptions, setOpenOptions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [modal, setModalOpen] = useState(false);
  const [addExercise, setAddExercise] = useState(false);
  const [deleteConfirmation, setdeleteConfirmation] = useState({});
  const [isRoutineDeleting, setisRoutineDeleting] = useState(false);
  const [isExerciseDeleting, setisExerciseDeleting] = useState(false);
  const [errors, setErrors] = useState();
  const [exerciseList, setExerciseList] = useState(false);
  const [option, setOption] = useState('');

  useEffect(() => {
    if (routine && !addExercise) {
      setisExerciseDeleting(false);
      setdeleteConfirmation(false);
      setExerciseList(routine.exercises);
    }
  }, [routine, addExercise])

  useEffect(() => {
    setErrors(deleteRoutine_res);
  }, [deleteRoutine_res])

  useEffect(() => {
    if (errors) {
      // alert(errors);
      setisRoutineDeleting(false);
      setisExerciseDeleting(false);
    }
  }, [errors])

  useEffect(() => {
    setErrors();
  }, []);

  const confirmRoutineDeletion = () => {
    setisRoutineDeleting(true);
    deleteRoutine({ routineId: _id });
  }

  const confirmExerciseDeletion = (id, supersetId) => {
    setisExerciseDeleting(true);
    let exs = {};
    let deleteSuperset;
    let exToAdd = [];
    let exToAddIndex = 0;

    if (supersetId) {
      exs = exerciseList.map((e, i) => {
        if (e._id === supersetId) {
          e.superset = e.superset.filter(ee => ee._id !== id);
          if (e.superset.length <= 1) {
            exToAdd = e.superset;
            exToAddIndex = i + 1
            deleteSuperset = e._id;
          }
        }
        return e;
      });
    } else {
      exs = exerciseList.filter(e => e._id !== id);
    }

    if (deleteSuperset) {
      exs.splice(exToAddIndex, 0, exToAdd[0]);
      if (exToAdd[1]) {
        exs.splice(exToAddIndex + 1, 0, exToAdd[1]);
      }
      exs = exs.filter(e => e._id !== deleteSuperset);
    }
    saveExList(null, null, exs);
  }

  const removeExFromSuperset = (ex) => {
    let exs = removeExerciseFromSuperset(exerciseList, ex);

    setExerciseList(exs);
    saveExList(null, null, exs);
  }

  const saveExList = (_, __, exList) => {
    let exercises = [...(exList || exerciseList).map(e => {
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
    })
    ];

    const {chartData, ...routineData} = routine;

    createRoutine({
      routineInput: {
        ...routineData,
        exercises
      }
    });
  }

  const setSuperset = (id, supersetId, index) => {
    let exs = setSupersetWithTheNext(exerciseList, index)

    if (exs) {
      setExerciseList(exs);
      saveExList(null, null, exs);
    }
  }


  const distX = 800;
  const cardVariants = {
    initial: (next, close) => ({
      x: !next ? -distX : distX,
      opacity: close ? 0 : 1,
      // position: "absolute",
      width: "100%",
    }),
    animate: {
      x: 0,
      opacity: 1,
      // position: "absolute",
      width:"100%",
      transition: {
        type: "ease",
        duration: 0.5,
        bounce: 0,
        delay: 0.2
      }
    },
    exit: (next) => ({
      x: next ? distX : -distX,
      opacity: 0,
      // position: "absolute",
      width: "100%",
      transition: {
        duration: 0.5,
        type: "ease",
        bounce: 0
      }
    })
  };

  return (
    routine && <motion.div
      initial={{
        opacity: 0,
      }}
      exit={{
        position: "absolute",
        width: "100%",
        opacity: 0,
        transition: {
          type: "ease",
          duration: 0.25,
          bounce: 0,
          // delay: 0.2
        }
      }}
      animate={{
        opacity: 1,
        transition: {
          type: "ease",
          duration: 0.25,
          bounce: 0,
          delay: 0.2
        }
      }}
    >
      <AnimatePresence>
        {addExercise &&
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={cardVariants}
            custom={addExercise, "close"}
          >
            <RoutineExerciseSelector
              key="opene-routine"
              routine={routine}
              close={() => setAddExercise(false)}
            />
          </motion.div>
        }
      </AnimatePresence>

      <Menu
        className="options-menu"
        anchorEl={anchorEl}
        open={openOptions}
        onClose={() => { setAnchorEl(null); setOpenOptions(false) }}
      >
        <MenuItem onClick={() => {
          setOpenOptions(false)
          setAddExercise(true)
        }}><AddIcon />Add Exercise</MenuItem>

        <MenuItem onClick={() => {
          setOpenOptions(false)
          setOption(option === '' ? 'reorder' : '')
        }}><DragIndicatorIcon />Reorder Exercises</MenuItem>

        <hr />
        <MenuItem onClick={() => {
          setOpenOptions(false)
          setModalOpen(true)
        }}><EditIcon />Edit Routine</MenuItem>

        <MenuItem onClick={() => {
          setOpenOptions(false)
          setdeleteConfirmation({ title: name, field: 'routine' })
        }}><DeleteIcon />Delete Routine</MenuItem>
      </Menu>

      <AnimatePresence initial={false} >
        {!addExercise &&
          <motion.div
            className="routineInfo-container"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={cardVariants}
          >
            <RoutineModal editRoutine={routine} open={modal} closeModal={() => setModalOpen(false)} edit={true} />

            <ConfirmDeletionModal
              deleteConfirmation={deleteConfirmation}
              onClose={() => setdeleteConfirmation(false)}
              isRoutineDeleting={isRoutineDeleting || isExerciseDeleting}
              confirmExerciseDeletion={confirmExerciseDeletion}
              confirmRoutineDeletion={confirmRoutineDeletion}
            />

            <motion.div className="header" >
              <div id="title" >
                <Button className="btn-back" onClick={close}><ArrowBackIosIcon /></Button>
                <div className="logo" style={{ color: routine.color,background:routine.color+"20", borderColor:routine.color+"15" }}>
                  <Whatshot />
                </div>
                <motion.h1
                  // layoutId={`h1-${routine._id}`}
                  style={{ color: routine.color }}
                >
                  {name}
                </motion.h1>
              </div>

              <div className="btns">
                <Button className="edit-routine" onClick={(e) => {
                  setOpenOptions(true);
                  setAnchorEl(e.currentTarget)
                }}><MoreVertIcon />
                </Button>
              </div>
            </motion.div>

            {exerciseList &&
              <Reorder.Group
                // layout
                transition={{
                  type: "ease",
                  duration: 0.3
                }}
                className="exercises-list"
                axis="y"
                values={exerciseList}
                onReorder={setExerciseList}>
                {
                  exerciseList.map((ex, i) => <Exercise
                    layout
                    index={i}
                    ex={ex}
                    key={ex._id || "del"}
                    option={option}
                    onDragEnd={saveExList}
                    deleteExercise={setdeleteConfirmation}
                    setSuperset={setSuperset}
                    setExerciseList={setExerciseList}
                    removeExFromSuperset={removeExFromSuperset}
                    exerciseList={exerciseList}
                    maincolor={routine.color}
                  />)
                }
              </Reorder.Group>
            }
          </motion.div>
        }
      </AnimatePresence>
    </motion.div >
  )
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  routines: selectRoutineList
});

const mapDispatchToProps = dispatch => ({
  deleteRoutine: routineId => dispatch(deleteRoutineStart(routineId)),
  createRoutine: routine => dispatch(createRoutineStart(routine)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutineInfo);