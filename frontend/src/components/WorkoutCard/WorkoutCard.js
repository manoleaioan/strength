import React from 'react';
import { MotionNumber } from '../MotionNumber/MotionNumber';
import { color, motion } from "framer-motion";

import "./WorkoutCard.scss";
import { CopyAll } from '@mui/icons-material';
import { Button } from '@mui/material';


const WorkoutCard = ({ workout, selectCopyWorkout, handleWorkoutCopySelect, ...props }) => {
  const maxInfo = 5;
  let infoDisplayed = 0;

  const getWorkoutInfo = () => {
    let data = {
      volume: 0,
      isoVol: 0,
      strength: 0,
      isoStrength: 0,
      reps: 0,
      sets: 0,
      iso: 0,
      maxRep: 0,
      maxIso: 0,
    }

    let prevVolume = 0;
    let prevIsoVol = 0;

    const flatExercises = workout.exercises.map(e => e.superset || e).flat();

    for (const ex of flatExercises) {
      data.sets += ex.records?.length || 0;

      for (const r of ex.records || []) {
        if (ex.exId.type === 0) {
          data.reps += r.record;
          data.volume += (r.weight === 0 ? r.record : r.record * r.weight);
          data.maxRep = r.record > data.maxRep ? r.record : data.maxRep;
        } else {
          data.iso += r.record;
          data.isoVol += (r.weight === 0 ? r.record : r.record * r.weight);
          data.maxIso = r.record > data.maxIso ? r.record : data.maxIso;
        }
      }

      for (const r of ex.prevRecords || []) {
        if (ex.exId.type === 0) {
          prevVolume += (r.weight === 0 ? r.record : r.record * r.weight);
        } else {
          prevIsoVol += (r.weight === 0 ? r.record : r.record * r.weight);
        }
      }
    }

    data.strength = (data.volume > 0 && prevVolume > 0) ? (((data.volume - prevVolume) / prevVolume) * 100).toFixed(0) : 0;
    data.isoStrength = (data.isoVol > 0 && prevIsoVol > 0) ? (((data.isoVol - prevIsoVol) / prevIsoVol) * 100).toFixed(0) : 0;

    let returnObj = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== 0));


    if (Object.entries(returnObj).length === 0) {
      returnObj.strength = 0;
      returnObj.sets = 0;
      returnObj.reps = 0;
      returnObj.maxRep = 0;
    }


    return returnObj;
  }

  const workoutInfo = getWorkoutInfo();

  const canDisplayInfo = (field) => {
    if (field) {
      infoDisplayed += 1;
    }

    return field && infoDisplayed <= maxInfo;
  }

  return (
    <motion.div
      className="workout-card workout"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ layout: { duration: 0.3 } }}
      layoutId={workout._id}
      style={{
        boxShadow: '0 3px 7px rgb(0 0 0 / 9%), inset 0px -40px 34px -34px ' + workout.color + "20",
        // backgroundColor: workout.color + "22",
        borderColor: workout.color + "20"
      }}
      {...props}
    >

      <div className='top-container'>
        <motion.div className="title" style={{ background: `linear-gradient(to right, transparent, ${workout.color}20, transparent)` }}>
          <motion.h1
            style={{ color: workout.color }}
            layoutId={`h1-${workout._id}`}>{workout.name}
          </motion.h1>
          <div className="hr"
            style={{ background: `linear-gradient(to right, transparent, ${workout.color}50, transparent)` }}
          ></div>
          <div className="info">
            <p>
              <span>{workout.exercises?.reduce((acc, e) => acc + (e?.superset ? e.superset.length : 1), 0)}</span>
              <span>Exercise{workout.exercises?.length !== 1 && "s"}</span>
            </p>
            {
              workout.exercises?.some(e => e?.superset?.length > 0) && (
                <p>| <span>{workout.exercises.filter(e => e?.superset?.length > 0).length}</span>
                  <span>Superset{workout.exercises?.filter(e => e?.superset?.length > 0).length !== 1 && "s"}</span>
                </p>
              )
            }
          </div>
          {selectCopyWorkout &&
            <Button
              className='copy-wk'
              style={{ background: workout.color, boxShadow: '0 3px 7px ' + workout.color + "50", }}
              onClick={(e) => handleWorkoutCopySelect(e, workout)}>
              <CopyAll /> Copy Workout
            </Button>
          }
        </motion.div>
      </div>

      <div className="bottom">
        {canDisplayInfo(workoutInfo.volume !== undefined && workoutInfo.volume !== workoutInfo.reps) && <div className="wrapper">
          <span className='info' style={{ color: workout.color }}>
            <MotionNumber value={workoutInfo.volume} inView={false}
            />
          </span>
          <p>Vol Kg</p>
        </div>
        }

        {
          canDisplayInfo(workoutInfo.strength !== undefined) && <div className="wrapper">
            <span className='info' style={{ color: workout.color }}>
              {workoutInfo.strength > 0 && <span>+</span>} <MotionNumber value={workoutInfo.strength} inView={false}
              /><span>%</span>
            </span>
            <p>Strength</p>
          </div>
        }

        {
          canDisplayInfo(workoutInfo.reps !== undefined) && <div className="wrapper">
            <span className='info' style={{ color: workout.color }}>
              <MotionNumber value={workoutInfo.reps}
                inView={false}
              />
            </span>
            <p>Reps</p>
          </div>
        }

        {
          canDisplayInfo(workoutInfo.sets !== undefined) &&
          <div className="wrapper">
            <span className='info' style={{ color: workout.color }}>
              <MotionNumber value={workoutInfo.sets} inView={false} />
            </span>
            <p>Sets</p>
          </div>
        }

        {
          canDisplayInfo(workoutInfo.maxRep !== undefined) && <div className="wrapper">
            <span className='info' style={{ color: workout.color }}>
              <MotionNumber value={workoutInfo.maxRep} inView={false} />
            </span>
            <p>Max Rep</p>
          </div>
        }

        {/* <div className="iso" style={{ display: "" }}> */}
        {canDisplayInfo(workoutInfo.isoVol !== undefined && workoutInfo.isoVol !== workoutInfo.iso) && <div className="wrapper">
          <span className='info' style={{ color: workout.color }}>
            <MotionNumber value={workoutInfo.isoVol} inView={false} />
          </span>
          <p>Iso Vol Kg</p>
        </div>
        }

        {
          canDisplayInfo(workoutInfo.isoStrength !== undefined) && <div className="wrapper">
            <span className='info' style={{ color: workout.color }}>
              {workoutInfo.isoStrength > 0 && <span>+</span>} <MotionNumber value={workoutInfo.isoStrength} inView={false}
              /><span>%</span>
            </span>
            <p>Iso</p>
          </div>
        }

        {
          canDisplayInfo(workoutInfo.iso !== undefined) && <div className="wrapper">
            <span className='info' style={{ color: workout.color }}>
              <MotionNumber value={workoutInfo.iso} inView={false} />
            </span>
            <p>Iso. sec.</p>
          </div>
        }

        {
          canDisplayInfo(workoutInfo.maxIso !== undefined) && <div className="wrapper">
            <span className='info' style={{ color: workout.color }}>
              <MotionNumber value={workoutInfo.maxIso} inView={false} />
            </span>
            <p>Max Iso</p>
          </div>
        }
      </div>

      {/* </div> */}
    </motion.div>
  )
}

export default WorkoutCard;