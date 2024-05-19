import { React, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { createWorkoutStart, getWorkoutDaysStart, getWorkoutsStart } from '../../redux/workout/workout.actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectWorkoutList } from '../../redux/workout/workout.selectors';
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Button, ThemeProvider, createTheme } from '@mui/material';
import { DateRange, ModeNight } from '@mui/icons-material';
import WorkoutInfo from '../../components/WorkoutInfo/WorkoutInfo';
import { ReactComponent as Workout } from '../../assets/Workout.svg';
import CreateWorkoutModal from '../../components/CreateWorkoutModal/CreateWorkoutModal';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Calendar from '../../components/Calendar/Calendar';
import classNames from 'classnames';
import WorkoutCard from '../../components/WorkoutCard/WorkoutCard';

import "./Workouts.scss";

dayjs.extend(utc);
dayjs.extend(timezone);

const Workouts = ({ user, getWorkouts, getWorkoutDays, workouts, workouts: { isLoading }, createWorkout }) => {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("startDate");
  const [errors, setErrors] = useState({});
  const [openWorkout, setOpenWorkout] = useState(false);
  const [modal, setModalOpen] = useState(false);
  const [workoutList, setWorkoutList] = useState(false);
  const openWorkoutRef = useRef(false);
  const [date, setDate] = useState(dayjs(workouts.selectedDate || Date.now()));
  const [calendarOpen, setCalendar] = useState(true);
  const theme = createTheme({
    typography: {
      fontFamily: [
        // 'Baloo Tamma 2',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

  const [calendarLoading, setCalendarLoading] = useState(true);
  const [selectCopyWorkout, setSelectCopyWorkout] = useState(false);

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

  useEffect(() => {
    if (openWorkoutRef.current) {
      if (!workouts.workoutList.find(e => e._id === openWorkoutRef.current)) {
        setOpenWorkout(false);
      }
    }

    setTimeout(() => {
      setWorkoutList(workouts.workoutList)
    }, openWorkoutRef.current ? 700 : 0);

  }, [workouts.workoutList]);

  useEffect(() => {
    openWorkoutRef.current = openWorkout;
  }, [openWorkout])

  const workoutFiltered = workoutList &&
    workoutList.filter(ex => ex.name.toLowerCase()
      .includes(search.toLowerCase()))
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
    if (workouts.workoutDays.days !== null) {
      setCalendarLoading(false);
    }
  }, [workouts.workoutDays]);

  useEffect(() => {
    if (!workouts.workoutList) {
      onCalendarChange(date);
    }
  }, [])

  const expandWorkout = (ex) => {
    setOpenWorkout(ex);
  };

  const onCalendarChange = date => {
    date = date
      .hour(dayjs().hour())
      .minute(dayjs().minute())
      .second(dayjs().second());

    // date = date
    //   .hour(0)
    //   .minute(0)
    //   .second(0);

    setDate(date);

    getWorkouts((date.hour(0).minute(0).second(0).millisecond(0)).toISOString());

    if (date.year().toString() !== workouts.workoutDays.year) {
      setCalendarLoading(true);
      getWorkoutDays({ year: date.year().toString(), utcOffset: dayjs().format('Z') });
    }
  }

  const onCalendarClick = () => {
    document.getElementById('content').scrollTo({ top: 0, behavior: 'smooth' });
    setCalendar(!calendarOpen);
  }

  const onWorkoutCreated = workout => {
    setModalOpen(false);
    setTimeout(() => {
      expandWorkout(workout._id);
    }, 700);
  }

  const handleOnMonthChanged = (date) => {
    if (date.year().toString() !== workouts.workoutDays.year) {
      onCalendarChange(date);
    }
  }

  const copyWorkoutCallback = () => {
    setTimeout(() => {
      setSelectCopyWorkout({ startDate: date });
      if (!calendarOpen) {
        setCalendar(true);
      }
    }, 200);
  }

  const abortSelectWorkout = () => {
    setDate(selectCopyWorkout.startDate);

    setTimeout(() => {
      setDate(selectCopyWorkout.startDate);
      setSelectCopyWorkout(false);
    }, 0);
  }

  const handleWorkoutCopySelect = (e, workout) => {
    e.stopPropagation();
    createWorkout({ workoutInput: { workoutId: workout._id, routineId: workout.routineId, startDate: selectCopyWorkout.startDate } }, () => {
      abortSelectWorkout();
      onCalendarChange(selectCopyWorkout.startDate);
    });
  }

  const selectedDateString = () => {
    const today = dayjs().startOf('day');
    const yesterday = dayjs().subtract(1, 'day').startOf('day');

    if (dayjs(date).isSame(today, 'day')) {
      return 'Today';
    } else if (dayjs(date).isSame(yesterday, 'day')) {
      return 'Yesterday';
    } else {
      return dayjs(date).format('D MMM YYYY');
    }
  }

  return <div className="workouts-container">
    <LayoutGroup>
      <AnimatePresence initial={true}>
        {!openWorkout &&
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            key="wrap1"
          >
            {/* HEADER */}
            <motion.div className="header sticky">
              <motion.div id="title"
                animate={{ opacity: expanded ? 0 : 1 }}
              >
                <h1>Workouts</h1>
                <div className='selected-date'>{selectedDateString()}</div>
              </motion.div>

              <div className="btns">
                <Button className={classNames({ 'disable': selectCopyWorkout }, "roundbtn add-workout")} onClick={() => setModalOpen(true)}><Workout /></Button>
                <Button className="roundbtn open-calendar" onClick={onCalendarClick}><DateRange /></Button>
              </div>
            </motion.div>

            <AnimatePresence>
              {
                selectCopyWorkout &&
                <motion.div className='info-select-wk' initial={{ opacity: 0, height: 0, y: -40, overflow: 'hidden' }} animate={{ opacity: 1, y: 0, height: "unset" }} exit={{ y: -40, height: 0, opacity: 0 }} transition={{ duration: 0.35 }} layout>
                  <p>Use the calendar to select the workout you want to copy</p>
                  <Button className="cancel" onClick={abortSelectWorkout}>
                    Cancel
                  </Button>
                </motion.div>
              }
            </AnimatePresence>

            {/* CALENDAR */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <AnimatePresence initial={false}>
                  {
                    calendarOpen && <motion.div
                      key='calendar'
                      layout="position"
                      transition={{ duration: 0.4 }}
                      initial={{ opacity: 0, y: -200 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -200, height: 0 }}
                    >
                      <Calendar
                        key={'calendar' + workouts.workoutDays.year}
                        views={["year", "day"]}
                        value={date}
                        loading={calendarLoading}
                        highlightedDays={workouts.workoutDays}
                        onChange={onCalendarChange}
                        onMonthChange={handleOnMonthChanged}
                      />
                    </motion.div>
                  }
                </AnimatePresence>

              </ThemeProvider>
            </LocalizationProvider>

            {/* WORKOUT LIST */}
            <motion.div className="workouts-list">
              {
                workoutFiltered?.length > 0
                && workoutFiltered.map(workout => <WorkoutCard
                  key={workout._id}
                  workout={workout}
                  onClick={() => expandWorkout(workout._id)}
                  selectCopyWorkout={selectCopyWorkout}
                  handleWorkoutCopySelect={handleWorkoutCopySelect}
                />)
              }

              <AnimatePresence>
                {
                  isLoading &&
                  [1, 2, 3].map(i => (
                    <motion.div className="workout skeleton" key={i} exit={{ opacity: "0", animation: "1s liniar", transition: { duration: 0.5 } }} ></motion.div>))
                }
              </AnimatePresence>

              {/* EMPTY DAY */}
              {!isLoading && workouts.workoutList?.length === 0 &&
                <motion.div className="empty-day"
                  layout
                  initial={{ opacity: !isLoading ? 0 : 1, transition: { delay: 0 } }}
                  animate={{ opacity: isLoading ? 0 : 1, transition: { duration: 0.25, delay: 0.25 } }}
                // exit={{ opacity: 0, transition: { duration: 0.25 } }}
                >
                  <div className='title'>
                    <ModeNight /> Empty day
                  </div>
                  <div onClick={() => setModalOpen(true)} className={classNames({ 'disable': selectCopyWorkout }, "startwk")}>
                    <Workout /> Start Workout
                  </div>
                </motion.div>
              }

            </motion.div>
          </motion.div>
        }

        {/* WORKOUT MODAL */}
        <CreateWorkoutModal key={'createwk'} layoutId="createwk" open={modal} closeModal={() => setModalOpen(false)} onWorkoutCreated={onWorkoutCreated} startDate={date} copyWorkoutCallback={copyWorkoutCallback} />

        {/* OPEN WORKOUT */}
        {openWorkout &&
          <WorkoutInfo
            key="opened-workout"
            workout={workoutList.find(e => e._id === openWorkout)}
            close={() => setOpenWorkout(false)}
            open={openWorkout}
          />
        }

      </AnimatePresence>
    </LayoutGroup>
  </div >
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  workouts: selectWorkoutList
});

const mapDispatchToProps = dispatch => ({
  getWorkouts: date => dispatch(getWorkoutsStart(date)),
  createWorkout: (workout, callback) => dispatch(createWorkoutStart(workout, callback)),
  getWorkoutDays: ({ year, utcOffset }) => dispatch(getWorkoutDaysStart({ year, utcOffset }))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Workouts);