import { React, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { createRoutineStart, getRoutinesStart } from '../../redux/routine/routine.actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectRoutineList } from '../../redux/routine/routine.selectors';
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { timeAgo } from '../../helpers/now';

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { SearchBtn } from '../../components/SearchBtn/SearchBtn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RoutineInfo from '../../components/RoutineInfo/RoutineInfo';
import RoutineModal from '../../components/RoutineModal/RoutineModal';

import "./Routines.scss";

const Routines = ({ user, getRoutines, routines, routines: { isLoading } }) => {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [errors, setErrors] = useState({});
  const [openRoutine, setopenRoutine] = useState(false);
  const [modal, setModalOpen] = useState(false);
  const [routineList, setroutineList] = useState(false);
  const openRoutineRef = useRef(false);

  useEffect(() => {
    if (openRoutineRef.current) {
      if (!routines.routineList.find(e => e._id === openRoutineRef.current)) {
        setopenRoutine(false);
      }
    }

    setTimeout(() => {
      setroutineList(routines.routineList)
    }, openRoutineRef.current ? 700 : 0);

  }, [routines.routineList]);

  useEffect(() => {
    openRoutineRef.current = openRoutine;
  }, [openRoutine])

  const routineFiltered = routineList &&
    routineList.filter(ex => ex.name.toLowerCase()
      .includes(search.toLowerCase()))
      .sort((a, b) => {
        a = a[sortBy].toString().toLowerCase();
        b = b[sortBy].toString().toLowerCase();

        if (sortBy === "activityAt")
          return a > b ? -1 : (a < b ? 1 : 0)

        return a < b ? -1 : (a > b ? 1 : 0)
      });

  useEffect(() => {
    if (!routines.routineList) {
      setTimeout(getRoutines, 0);
    }
  }, [routines.routineList, getRoutines]);

  const expandRoutine = (ex) => {
    setopenRoutine(ex);
  };


  return <div className="routines-container">
    <LayoutGroup>
      {!openRoutine &&
        <div className="header sticky">
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
        </div>
      }

      <RoutineModal open={modal} closeModal={() => setModalOpen(false)} />

      <AnimatePresence >
        {openRoutine &&
          <RoutineInfo
            key="opene-routine"
            routine={routineList.find(e => e._id === openRoutine)}
            close={() => setopenRoutine(false)}
            open={openRoutine}
          />
        }
      </AnimatePresence>
      <AnimatePresence>

        {!openRoutine &&
          <motion.div className="routines-list"
            exit={{
              // opacity:!openRoutine ? 1 : 0,
              position: "absolute",
              width: "100%",
              opacity: 0,
              scale:0,
              y: 1000,
              // x:800,
              transition: {
                duration: 0.25
              }
            }}
          >
            {isLoading && [1, 2, 3].map(i => <div className="routine skeleton" key={i}></div>)}

            {routineFiltered && (
              routineFiltered.length === 0
                ? <p className="no-results">{routineList.length === 0 ? "No routines" : "No results found :("}</p>
                : routineFiltered.map(routine =>
                  <AnimatePresence key={routine._id}>

                    <motion.div className="routine"
                      // transition={{ layout:{duration:3} }}
                      layoutId={routine._id}
                      onClick={() => expandRoutine(routine._id)}
                      style={{
                        backgroundColor: routine.color + "22",
                        borderRadius: 14,
                        // opacity: !openRoutine ? 1 : 0,
                        //  scale: openRoutine !== routine._id ? 1 : 0,
                        // boxShadow:  `inset 0 0 30px ${routine.color}19`
                      }}


                    // initial={{ opacity: 0}}
                    // animate={{ opacity: 1}}
                    // exit={{ opacity: 0 }}
                    >

                      <motion.div className="title"

                      >
                        <motion.h1 style={{ color: routine.color }} layoutId={`h1-${routine._id}`}>{routine.name}</motion.h1>
                        <motion.div layoutId={`exercises-${routine._id}`} className="info" layout>{routine.exercises?.length}<span>Exercises</span></motion.div>
                      </motion.div>

                      <motion.div className="time">
                        <p>Last workout </p><AccessTimeIcon />
                        <p className="date">{timeAgo(routine.activityAt)}</p>
                      </motion.div>
                    </motion.div>

                  </AnimatePresence>
                )
            )}

          </motion.div>
        }
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