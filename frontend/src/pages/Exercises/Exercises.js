import { React, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { createExerciseStart, getExercisesStart } from '../../redux/exercise/exercise.actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectExerciseList } from '../../redux/exercise/exercise.selectors';
import { motion } from "framer-motion";

import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { SearchBtn } from '../../components/SearchBtn/SearchBtn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SortIcon from '@mui/icons-material/Sort';
import ExerciseInfo from '../../components/ExerciseInfo/ExerciseInfo';
import ExerciseModal from '../../components/ExerciseModal/ExerciseModal';

import "./Exercises.scss";
import TimeAgo from '../../components/TimeAgo';

const Exercises = ({ user, getExercises, exercises, exercises: { isLoading } }) => {
  const [expanded, setExpanded] = useState(false);
  const [openSortMenu, setOpenSortMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState("activityAt");
  const [errors, setErrors] = useState({});
  const [openExercise, setOpenExercise] = useState(false);
  const [modal, setModalOpen] = useState(false);
  const [exerciseList, setExerciseList] = useState(false);
  const openExerciseRef = useRef(false);

  useEffect(() => {
    if (openExerciseRef.current) {
      if (!exercises.exerciseList.find(e => e._id === openExerciseRef.current)) {
        setOpenExercise(false);
      }
    }

    setTimeout(() => {
      setExerciseList(exercises.exerciseList)
    }, openExerciseRef.current ? 700 : 0);

  }, [exercises.exerciseList]);

  useEffect(() => {
    openExerciseRef.current = openExercise;
  }, [openExercise])

  const exerciseFiltered = exerciseList &&
  exerciseList.filter(ex => ex.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "activityAt") {
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
    if (!exercises.exerciseList) {
      setTimeout(getExercises, 0);
    }
  }, [exercises.exerciseList, getExercises]);

  const onClickSortOption = filter => {
    setSortBy(filter)
    setOpenSortMenu(false)
  };

  const expandExercise = (ex) => {
    setOpenExercise(ex);
  };

  return (
    <div className="exercises-container">
      {!openExercise &&
        <div className="header sticky">

          <motion.div id="title"
            animate={{ opacity: expanded ? 0 : 1 }}
          >
            <h1>Exercises</h1>
            <div className="sort-by" onClick={(e) => {
              if (expanded) return;
              setOpenSortMenu(true);
              setAnchorEl(e.currentTarget)
            }}>
              <SortIcon /><p>{sortBy === "activityAt" ? "Activity" : sortBy}</p>
            </div>

            <Menu
              className="sort-menu"
              anchorEl={anchorEl}
              open={openSortMenu}
              onClose={() => { setAnchorEl(null); setOpenSortMenu(false) }}
            >
              <MenuItem onClick={() => onClickSortOption("type")}>Type</MenuItem>
              <MenuItem onClick={() => onClickSortOption("name")}>Name</MenuItem>
              <MenuItem onClick={() => onClickSortOption("activityAt")}>Activity</MenuItem>
            </Menu>

          </motion.div>

          <div className="btns">
            <SearchBtn expanded={expanded} setExpanded={setExpanded} setSearch={setSearch} value={search} />
            <Button className="roundbtn add-exercise" onClick={() => setModalOpen(true)}><AddIcon /></Button>
          </div>
        </div>
      }

      <ExerciseModal open={modal} closeModal={() => setModalOpen(false)} />

      {openExercise && <ExerciseInfo
        key="openex-ex"
        exercise={exerciseList.find(e => e._id === openExercise)}
        close={() => {
          setOpenExercise(false)
        }}
      />}

      <div className="exercises-list">
        {isLoading && [1, 2, 3].map(i => <div className="exercise skeleton" key={i}></div>)}

        {!openExercise && exerciseFiltered && (
          exerciseFiltered.length === 0
            ? <p className="no-results">{exerciseList.length === 0 ? "No exercises" : "No results found :("}</p>
            : exerciseFiltered.map(ex =>
              <motion.div className="exercise"
                transition={{ duration: 0.4 }}
                initial={{ opacity: openExercise ? 0 : 1 }}
                exit={{ opacity: 0 }}
                key={ex.name}
                layoutId={ex._id}
                layout="position"
                onClick={() => expandExercise(ex._id)}
              >
                <div className="title">
                  <h1>{ex.name} </h1>
                  <div className="info">{ex.type === 0 ? 'RM/VOL' : 'Max ISO/VOL'}<span>{ex.maxRep}</span> / <span>{ex.maxVol}</span></div>
                </div>

                {
                  ex.activityAt &&
                  <div className="time">
                    <AccessTimeIcon /> <p>{<TimeAgo date={ex.activityAt}/>}</p>
                  </div>
                }

              </motion.div>
            )
        )}

      </div>

    </div >
  )
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  exercises: selectExerciseList
});


const mapDispatchToProps = dispatch => ({
  getExercises: () => dispatch(getExercisesStart()),
  createExercise: exercise => dispatch(createExerciseStart(exercise)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Exercises);