import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectWorkoutList } from '../../redux/workout/workout.selectors';
import { deleteWorkoutStart, createWorkoutStart } from '../../redux/workout/workout.actions';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button, CircularProgress } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Modal from '../Modal';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RoutineExerciseSelector from '../RoutineExerciseSelector/RoutineExerciseSelector';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import WorkoutEditModal from '../WorkoutEditModal/WorkoutEditModal';
import WorkoutExerciseSelector from '../WorkoutExerciseSelector/WorkoutExerciseSelector';
import { removeExerciseFromSuperset, setSupersetWithTheNext } from "../../helpers/exerciseUtils";
import { ReactComponent as WeightLogo } from '../../assets/Weight.svg';
import RecordSetModal from '../RecordSetModal/RecordSetModal';
import classNames from 'classnames';

import "./WorkoutInfo.scss";
import { ArrowDownward, ArrowDownwardOutlined, ArrowDownwardRounded, ArrowDropDown, ArrowDropUp, ArrowUpwardOutlined, KeyboardArrowDown, KeyboardArrowUp, KeyboardArrowUpOutlined } from '@mui/icons-material';


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

const IndicatorBar = ({ ex, setOpenPrev, openPrev }) => {
  let volume = ex.records.reduce((acc, r) => acc + (r.weight === 0 ? r.record : r.record * r.weight), 0);
  let preVolume = ex.prevRecords.reduce((acc, r) => acc + (r.weight === 0 ? r.record : r.record * r.weight), 0);
  let volPercentageChange = (((volume - preVolume) / preVolume) * 100).toFixed(0);
  let volChange = Math.abs(volume - preVolume).toFixed(0);

  let reps = ex.records.reduce((acc, r) => acc + r.record, 0);
  let prevReps = ex.prevRecords.reduce((acc, r) => acc + r.record, 0);
  let repsPercentageChange = (((reps - prevReps) / prevReps) * 100).toFixed(0);
  let repsChange = Math.abs(reps - prevReps).toFixed(0);

  let displayVol = volPercentageChange != 0;
  let displayReps = repsPercentageChange != 0;

  return (
    (displayVol || displayReps ) && <div className={classNames({'open-prev':openPrev}, 'indicators')} onClick={() => setOpenPrev(open => !open)}>
      {
        displayVol&&
        <div className={classNames({ 'increase': volPercentageChange > 0 }, 'vol-indicator indicator')}>
          <span>VOL</span> <div className='values'>
            {volPercentageChange >= 0 ?
              <ArrowDropUp className='up' />
              : <ArrowDropDown className='down' />}  {volChange} ({volPercentageChange}%)
          </div>
        </div>
      }

      {
        displayReps &&
        <div className={classNames({ 'increase': repsPercentageChange > 0 }, 'vol-indicator indicator')}>
          <span>REPS</span> <div className='values'>
            {repsPercentageChange >= 0 ?
              <ArrowDropUp className='up' />
              : <ArrowDropDown className='down' />}  {repsChange} ({repsPercentageChange}%)
          </div>
        </div>
      }
    </div>
  );
}

const Exercise = (props) => {
  const dragControls = useDragControls();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openOptions, setOpenOptions] = useState(false);
  const { ex, onDragEnd, option, deleteExercise, setSuperset, setExerciseList, removeExFromSuperset, exerciseList, maincolor, supersetId, index, setRecordSetModal } = props;

  const superSetNr = ex.superset && supersetIndex(exerciseList, ex._id)
  const [openPrev, setOpenPrev] = useState(false);

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
                index={index}
                maincolor={maincolor}
                setRecordSetModal={setRecordSetModal}
              />)
              // ex.superset.map(e=>console.log(e))
            }
          </Reorder.Group>
          : ex.exId && <>

            <div className="top">

              <div className='left'>
                <motion.div
                  className="title">
                  <h1>{ex.exId.name}</h1>

                  {/* <div className="info">{ex.type === 0 ? 'RM/VOL' : 'Max ISO/VOL'}<span>{ex.maxRep}</span> / <span>{ex.maxVol}</span></div> */}
                </motion.div>

                <motion.div className='records'>
                  {
                    ex.records?.map((r, i) =>
                      <Button key={`record-${i}`} onClick={() => setRecordSetModal({ _id: ex._id, exId: ex.exId, edit: true, setNr: i, ...r })}
                        className='record' style={{ color: maincolor, background: maincolor + '10', borderColor: maincolor + '10' }}
                      >
                        <div className='rep'>
                          {r.record}
                        </div>

                        {r?.weight > 0 &&
                          <span className='weight'
                            style={{ color: maincolor, fill: maincolor, background: maincolor + '10', boxShadow: `0px 6px 19px 0px ${maincolor}70`, borderColor: maincolor + '40' }}
                          >{r.weight}
                            <span className='kg'>kg</span>
                          </span>
                        }
                      </Button>
                    )
                  }
                </motion.div>

              </div>
              {option === 'reorder' ?
                <div className="drag" onPointerDown={(e) => dragControls.start(e)}>
                  <DragIndicatorIcon />
                </div>
                : <div className='ex-ctrls'>
                  {/* <Button className='prev-btn' onClick={() => setOpenPrev(open => !open)}>
                    <ArrowUpwardOutlined />
                  </Button> */}
                  <Button className="record-set" style={{ color: maincolor, background: maincolor + '10', borderColor: maincolor + '10' }} onClick={(e) => {
                    setRecordSetModal({ _id: ex._id, exId: ex.exId, setNr: ex.records?.length || 0 });
                  }}><AddIcon />
                  </Button>

                  <Button className="edit-ex" onClick={(e) => {
                    setOpenOptions(true);
                    setAnchorEl(e.currentTarget)
                  }}><MoreVertIcon />
                  </Button>
                </div>
              }

            </div>

            {
              ex.records && ex.prevRecords && <IndicatorBar ex={ex} setOpenPrev={setOpenPrev}  openPrev={openPrev}/>
            }

            <AnimatePresence>
              {
                openPrev && <motion.div className="prev-container"
                  // layout
                  initial={{ height: "0.1", opacity: 0 }}
                  animate={{ height: "100%", opacity: 1 }}
                  exit={{ height: "0", opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="prev">
                    <h1>Previous</h1>
                    <div className="records">
                      {
                        ex.prevRecords?.map((r, i) =>
                          <div key={`record-${i}`}
                            className='record' style={{ color: maincolor, background: maincolor + '10', borderColor: maincolor + '10' }}
                          >
                            <div className='rep'>
                              {r.record}
                            </div>

                            {r?.weight > 0 &&
                              <span className='weight'
                                style={{ color: maincolor, fill: maincolor, background: maincolor + '10', boxShadow: `0px 6px 19px 0px ${maincolor}70`, borderColor: maincolor + '40' }}
                              >{r.weight}
                                <span className='kg'>kg</span>
                              </span>
                            }
                          </div>
                        )
                      }
                    </div>
                  </div>

                </motion.div>
              }
            </AnimatePresence>

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

const ConfirmDeletionModal = ({ deleteConfirmation, onClose, isWorkoutDeleting, confirmExerciseDeletion, confirmWorkoutDeletion }) => <Modal
  className="modal-del-ex"
  onClose={onClose}
  open={deleteConfirmation.field}
>
  <header>
    {`Deleting ${deleteConfirmation.title}`}
  </header>

  <div className="info">
    <InfoOutlinedIcon />
    Do you really want to delete this {deleteConfirmation.field === 'workout' ? 'workout' : 'exercise'}?
    This action cannot be undone.
  </div>

  <div className="ctrl">
    <Button className="del" type="submit" disabled={isWorkoutDeleting}
      onClick={deleteConfirmation.field === 'workout' ? confirmWorkoutDeletion
        : () => confirmExerciseDeletion(deleteConfirmation.id, deleteConfirmation.supersetId)}>
      {isWorkoutDeleting && <CircularProgress className="loader" />}DELETE
    </Button>
    <Button className="cancel" onClick={onClose} disabled={isWorkoutDeleting}>Cancel</Button>
  </div>
</Modal>


const WorkoutInfo = ({ createWorkout, workout, close, deleteWorkout, workouts: { deleteWorkout_res } }) => {
  const { name, type, _id } = workout || {};
  const [openOptions, setOpenOptions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [modal, setModalOpen] = useState(false);
  const [addExercise, setAddExercise] = useState(false);
  const [deleteConfirmation, setdeleteConfirmation] = useState({});
  const [isWorkoutDeleting, setisWorkoutDeleting] = useState(false);
  const [isExerciseDeleting, setisExerciseDeleting] = useState(false);
  const [errors, setErrors] = useState();
  const [exerciseList, setExerciseList] = useState(false);
  const [option, setOption] = useState('');
  const [recordSetModal, setRecordSetModal] = useState(false);

  useEffect(() => {
    if (workout && !addExercise) {
      setisExerciseDeleting(false);
      setdeleteConfirmation(false);
      setExerciseList(workout.exercises);
    }
  }, [workout, addExercise])

  useEffect(() => {
    setErrors(deleteWorkout_res);
  }, [deleteWorkout_res])

  useEffect(() => {
    if (errors) {
      // alert(errors);
      setisWorkoutDeleting(false);
      setisExerciseDeleting(false);
    }
  }, [errors])

  useEffect(() => {
    setErrors();
  }, []);

  const confirmWorkoutDeletion = () => {
    setisWorkoutDeleting(true);
    deleteWorkout({ workoutId: _id });
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
    let exs = removeExerciseFromSuperset(exerciseList, ex)

    setExerciseList(exs);
    saveExList(null, null, exs);
  }

  const saveExList = (_, __, exList) => {
    let exercises = [...(exList || exerciseList).map(e => {
      return {
        _id: e._id,
        ...(e.exId?._id && { exId: e.exId, records: e?.records }),
        ...(e.superset?.length > 0 && {
          superset: e.superset.map(s => {
            return {
              _id: s._id,
              exId: s.exId,
              records: s?.records
            }
          })
        })
      }
    })
    ];

    console.log(exercises)

    createWorkout({
      workoutInput: {
        ...workout,
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
      position: "absolute",
      width: "100%",
    }),
    animate: {
      x: 0,
      opacity: 1,
      width: "100%",
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
      position: "absolute",
      width: "100%",
      transition: {
        duration: 0.5,
        type: "ease",
        bounce: 0
      }
    })
  };


  return (
    workout && <motion.div
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
            <WorkoutExerciseSelector
              key="opene-workout"
              workout={workout}
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
        }}><EditIcon />Edit Workout</MenuItem>

        <MenuItem onClick={() => {
          setOpenOptions(false)
          setdeleteConfirmation({ title: name, field: 'workout' })
        }}><DeleteIcon />Delete Workout</MenuItem>
      </Menu>

      <AnimatePresence initial={false} >
        {!addExercise &&
          <motion.div
            className="workout-info-container"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={cardVariants}
          >
            <WorkoutEditModal editWorkout={workout} open={modal} closeModal={() => setModalOpen(false)} edit={true} />

            <ConfirmDeletionModal
              deleteConfirmation={deleteConfirmation}
              onClose={() => setdeleteConfirmation(false)}
              isWorkoutDeleting={isWorkoutDeleting || isExerciseDeleting}
              confirmExerciseDeletion={confirmExerciseDeletion}
              confirmWorkoutDeletion={confirmWorkoutDeletion}
            />

            <RecordSetModal editWorkout={workout} exercise={recordSetModal} closeModal={() => setRecordSetModal(false)} edit={true} />

            <motion.div className="header" >
              <div id="title" >
                <Button className="btn-back" onClick={close}><ArrowBackIosIcon /></Button>
                <motion.h1
                  // layoutId={`h1-${workout._id}`}
                  style={{ color: workout.color }}
                >
                  {name}
                </motion.h1>
              </div>

              <div className="btns">
                <Button className="edit-workout" onClick={(e) => {
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
                  // [...Array(20)].map(ex => <Exercise ex={{ex:{maxRep:0,maxVol:0,type:0}}} key={ex} />)
                  exerciseList.map((ex, i) => <Exercise
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
                    maincolor={workout.color}
                    setRecordSetModal={setRecordSetModal}
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
  workouts: selectWorkoutList
});

const mapDispatchToProps = dispatch => ({
  deleteWorkout: workoutId => dispatch(deleteWorkoutStart(workoutId)),
  createWorkout: workout => dispatch(createWorkoutStart(workout)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkoutInfo);