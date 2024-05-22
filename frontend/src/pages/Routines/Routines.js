import { React, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { createRoutineStart, getRoutinesStart } from '../../redux/routine/routine.actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectRoutineList } from '../../redux/routine/routine.selectors';
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { timeAgo } from '../../helpers/now';
import { CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { SearchBtn } from '../../components/SearchBtn/SearchBtn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoutineInfo from '../../components/RoutineInfo/RoutineInfo';
import RoutineModal from '../../components/RoutineModal/RoutineModal';
import { MotionNumber } from '../../components/MotionNumber/MotionNumber';
import classNames from 'classnames';

import "./Routines.scss";

const Routines = ({ user, getRoutines, routines, routines: { isLoading } }) => {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("lastWorkoutDate");
  const [errors, setErrors] = useState({});
  const [openRoutine, setopenRoutine] = useState(false);
  const [modal, setModalOpen] = useState(false);
  const [routineList, setRoutineList] = useState(false);
  const openRoutineRef = useRef(false);
  const init = useRef(true);

  useEffect(() => {
    if (openRoutineRef.current) {
      if (!routines.routineList.find(e => e._id === openRoutineRef.current)) {
        setopenRoutine(false);
      }
    }

    setTimeout(() => {
      setRoutineList(routines.routineList)
    }, openRoutineRef.current ? 700 : 0);

  }, [routines.routineList]);

  useEffect(() => {
    openRoutineRef.current = openRoutine;
  }, [openRoutine])

  const routineFiltered = routineList &&
    routineList.filter(r => r.name.toLowerCase()
      .includes(search.toLowerCase()))
      .sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        if (sortBy === "lastWorkoutDate") {
          if (aValue == null) return 1;
          if (bValue == null) return -1;
          aValue = aValue.toString().toLowerCase();
          bValue = bValue.toString().toLowerCase();
          return aValue > bValue ? -1 : (aValue < bValue ? 1 : 0);
        }

        if (aValue == null) return 1;
        if (bValue == null) return -1;
        aValue = aValue.toString().toLowerCase();
        bValue = bValue.toString().toLowerCase();
        return aValue < bValue ? -1 : (aValue > bValue ? 1 : 0);
      });

  useEffect(() => {
    if (!routines.routineList) {
      setTimeout(getRoutines, 0);
      console.log('ger')
    }
  }, [routines.routineList, getRoutines]);


  const expandRoutine = (ex) => {
    setopenRoutine(ex);
  };

  const cardVariants = {
    initial: (next, close) => ({
      opacity: close ? 0 : 1,
      position: "absolute",
      width: "100%",
    }),
    animate: {
      x: 0,
      opacity: 1,
      position: "unset",
      transition: {
        // type: "ease",
        duration: 0.25,
        bounce: 0,
        delay: 0.2
      }
    },
    exit: (next) => ({
      opacity: 0,
      position: "absolute",
      width: "100%",
      transition: {
        duration: 0.25,
        // type: "ease",
        bounce: 0
      }
    })
  };

  const dummyChartData = [
    { "vol": 4 }, { "vol": 8 }, { "vol": 12 }, { "vol": 8 }, { "vol": 14 }
  ]

  return <div className="routines-container">
    <LayoutGroup>
      <RoutineModal open={modal} closeModal={() => setModalOpen(false)} />

      <AnimatePresence initial={false}>
        {openRoutine &&
          <RoutineInfo
            key="opene-routine"
            routine={routineList.find(e => e._id === openRoutine)}
            close={() => setopenRoutine(false)}
            open={openRoutine}
          />
        }

        {!openRoutine && <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.div className="header sticky">
            <motion.div id="title"
              animate={{ opacity: expanded ? 0 : 1 }}
            >
              <h1>Routines</h1>
              <span className="underline"></span>
            </motion.div>

            <div className="btns">
              <SearchBtn expanded={expanded} setExpanded={setExpanded} setSearch={setSearch} value={search} />
              <Button className="roundbtn add-routine" onClick={() => setModalOpen(true)}><AddIcon /></Button>
            </div>
          </motion.div>

          <div className="routines-list">
            {isLoading && [1, 2, 3].map(i => <div className="routine skeleton" key={i}></div>)}


            {routineFiltered && !isLoading && (
              routineFiltered.length === 0
                ? <p className="no-results">{routineList.length === 0 ? "No routines" : "No results found :("}</p>
                : routineFiltered.map(routine =>
                  <motion.div className="routine"
                    key={routine._id}
                    transition={{ layout: { duration: 0.3 } }}
                    layoutId={routine._id}
                    onClick={() => expandRoutine(routine._id)}
                  // style={{ boxShadow: '0 3px 7px rgb(0 0 0 / 9%), inset 0px -40px 34px -34px ' + routine.color + "20"}}
                  >

                    <div className='top-container'>
                      <motion.div className="title">
                        <motion.h1
                          style={{ color: routine.color }}
                          layoutId={`h1-${routine._id}`}>{routine.name}
                        </motion.h1>
                        <div className="info">
                          <p>
                            <span>{routine.exercises?.reduce((acc, e) => acc + (e?.superset ? e.superset.length : 1), 0)}</span>
                            <span>Exercise{routine.exercises?.length !== 1 && "s"}</span>
                          </p>
                          {
                            routine.exercises?.some(e => e?.superset?.length > 0) && (
                              <p>| <span>{routine.exercises.filter(e => e?.superset?.length > 0).length}</span>
                                <span>Superset{routine.exercises?.filter(e => e?.superset?.length > 0).length !== 1 && "s"}</span>
                              </p>
                            )
                          }
                          <p className="wk-counter">| <span>{routine.workoutsComplete}</span>
                            <span>Workout{(routine.workoutsComplete !== 1) && "s"}</span>
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    <div className="bottom">
                      <div className="workouts wk-counter-main">
                        <span style={{ color: routine.color }}>
                          <MotionNumber value={routine.workoutsComplete || 0} disabled={!init.current && 1 == 2} inView={false} init={init} />
                        </span>
                        <p>Workout{routine.workoutsComplete !== 1 && "s"}</p>
                      </div>
                      <div className="chart-container">
                        {(!routine.chartData || routine.chartData.length === 0) && <div className='na'>N/A</div>}

                        <ResponsiveContainer width="100%" className={classNames({ 'no-data': (!routine.chartData || routine.chartData.length === 0) }, 'chart')}>
                          <AreaChart
                            data={routine.chartData?.length > 0 ? routine.chartData : dummyChartData}
                            margin={{
                              right: -7,
                              left: -7,
                              bottom: 5
                            }}
                          >
                            <defs>
                              <linearGradient id={"volGradient-" + routine._id} x1="0%" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={routine.color} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={routine.color} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <Area
                              type="monotone"
                              stackId="1"
                              dataKey="vol"
                              stroke={routine.color}
                              fill={`url(#volGradient-${routine._id})`}
                              isAnimationActive={init.current && routine.chartData?.length > 0}
                            />
                            <CartesianGrid strokeDasharray="5 5" stroke="var(--routine-card-split-line)" />
                          </AreaChart>

                        </ResponsiveContainer>

                      </div>
                      <div className="time">
                        <AccessTimeIcon />
                        <p className="date">{routine.lastWorkoutDate ? timeAgo(routine.lastWorkoutDate) : "N/A"}</p>
                      </div>
                    </div>
                  </motion.div>

                )
            )}
          </div>
        </motion.div>}
      </AnimatePresence>

    </LayoutGroup>
  </div >
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  routines: selectRoutineList
});


const mapDispatchToProps = dispatch => ({
  getRoutines: () => dispatch(getRoutinesStart()),
  createRoutine: routine => dispatch(createRoutineStart(routine)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Routines);