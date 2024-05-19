import React, { useState, useEffect, useRef, memo, useMemo } from 'react';
import { motion } from "framer-motion";
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectExerciseList } from '../../redux/exercise/exercise.selectors';
import { createExerciseStart, deleteExerciseStart, getExerciseChardDataStart } from '../../redux/exercise/exercise.actions';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button, CircularProgress } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ExerciseModal from '../ExerciseModal/ExerciseModal';
import Modal from '../../components/Modal';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { RestartAlt } from '@mui/icons-material';

import "./ExerciseInfo.scss";
import { MotionNumber } from '../MotionNumber/MotionNumber';
import dayjs from 'dayjs';
import classNames from 'classnames';


const ExerciseInfo = ({ exercise, close, deleteExercise, createExercise, exercises: { deleteExercise_res, exerciseChart }, getExerciseChartData }) => {
  const { name, type, _id } = exercise || {};
  const [openOptions, setOpenOptions] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [modal, setModalOpen] = useState(false);
  const [deleteConfirmation, setdeleteConfirmation] = useState(false);
  const [isExerciseDeleting, setIsExerciseDeleting] = useState(false);
  const [errors, setErrors] = useState();
  const [chartPeriod, setChartPeriod] = useState("3M");
  const [chartDataView, setChartDataView] = useState("reps");

  const confirmDeletion = (deleteConfirmation) => {
    setIsExerciseDeleting(true);

    if (deleteConfirmation?.reset) {
      let exerciseInput = exercise;

      if (deleteConfirmation.reset == 'MR') {
        exerciseInput.maxRep = 0;
      } else {
        exerciseInput.maxVol = 0;
      }

      createExercise({ exerciseInput })
    } else {

      deleteExercise({ exerciseId: _id });
    }
  }

  useEffect(() => {
    setdeleteConfirmation(false);
    setIsExerciseDeleting(false);
  }, [exercise]);

  useEffect(() => {
    setErrors(deleteExercise_res);
  }, [deleteExercise_res])

  useEffect(() => {
    if (errors) {
      alert(errors);
      setIsExerciseDeleting(false);
    }
  }, [errors])


  useEffect(() => {
    setErrors();
    onSelectChartPeriod();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${year}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          {chartDataView === 'reps' ?
            <p className="label rep">{payload[0]?.value} REP{payload[0]?.value > 1 && "S"}</p>
            : <p className="label vol">{payload[0]?.value} KG</p>
          }
          <p className="label date">{dayjs(label).format('D MMM YYYY')}</p>
        </div>
      );
    }

    return null;
  };

  const onSelectChartPeriod = (period = chartPeriod) => {
    getExerciseChartData({
      exerciseId: exercise._id,
      period
    });

    setChartPeriod(period);
  }

  return (
    exercise && <motion.div
      layoutId={_id}
      transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
      animate={{ opacity: 1 }}
      className="exerciseInfo-container">

      <div className="header">
        <motion.div id="title">
          <Button className="btn-back" onClick={close}><ArrowBackIosIcon /></Button>
          <h1> {name}</h1>

        </motion.div>

        <div className="btns">
          <Button className="edit-exercise" onClick={(e) => {
            setOpenOptions(true);
            setAnchorEl(e.currentTarget)
          }}><MoreVertIcon />
          </Button>

          <Menu
            className="options-menu"
            anchorEl={anchorEl}
            open={openOptions}
            onClose={() => { setAnchorEl(null); setOpenOptions(false) }}
          >
            <MenuItem onClick={() => {
              setModalOpen(true)
              setOpenOptions(false)
            }}><EditIcon />Edit</MenuItem>

            <MenuItem onClick={() => {
              setOpenOptions(false)
              setdeleteConfirmation(true)
            }}><DeleteIcon />Delete</MenuItem>

            <hr />

            <MenuItem onClick={() => {
              setOpenOptions(false)
              setdeleteConfirmation({ reset: "MR" })
            }}><RestartAlt />Reset MAX REP</MenuItem>

            <MenuItem onClick={() => {
              setOpenOptions(false)
              setdeleteConfirmation({ reset: "VOL" })
            }}><RestartAlt />Reset MAX VOL</MenuItem>
          </Menu>
        </div>
      </div>

      <ExerciseModal editEx={exercise} open={modal} closeModal={() => setModalOpen(false)} edit={true} />

      <Modal className="modal-del-ex" onClose={() => setdeleteConfirmation(false)} open={deleteConfirmation} >
        <header>
          {`${!deleteConfirmation?.reset ? 'Deleting' : 'Resetting'} ${name}`}
        </header>

        <div className="info">
          <InfoOutlinedIcon />
          {
            deleteConfirmation?.reset
              ?
              'Do you really want to reset this record?'
              : `
                Do you really want to delete this exercise?
                This action cannot be undone.
              `
          }

        </div>

        <div className="ctrl">
          <Button className="del" type="submit" disabled={isExerciseDeleting} onClick={() => confirmDeletion(deleteConfirmation)}>
            {isExerciseDeleting && <CircularProgress className="loader" />}{deleteConfirmation?.reset ? "RESET" : "DELETE"}
          </Button>
          <Button className="cancel" onClick={() => setdeleteConfirmation(false)} disabled={isExerciseDeleting}>Cancel</Button>
        </div>

      </Modal>

      <motion.div
        className="content"
      >
        <div className="max-records">
          <div className="record mr">
            <span>
              MAX REP
            </span>
            <h1>
              <MotionNumber value={exercise.maxRep} keyy={'bla'}/>
            </h1>
          </div>
          <div className="record vol">
            <span>
              MAX VOLUME
            </span>
            <h1>
              <MotionNumber value={exercise.maxVol} />
            </h1>
          </div>
        </div>

        <div className="chart-wrapper">
          <div className="header">
            <div>
              {/* <h3>Overview</h3> */}
              <div className="select">
                <span className={classNames({ 'active': chartDataView === 'reps' }, 'reps')} onClick={() => setChartDataView('reps')}>Reps</span>
                <span className={classNames({ 'active': chartDataView === 'vol' }, 'vol')} onClick={() => setChartDataView('vol')}>Vol</span>
              </div>
            </div>
            <div className={classNames({ 'reps': chartDataView === 'reps' }, 'periods')}>
              <Button className={classNames({ 'active': chartPeriod === "1W" })} onClick={() => onSelectChartPeriod('1W')}>1W</Button>
              <Button className={classNames({ 'active': chartPeriod === "1M" })} onClick={() => onSelectChartPeriod('1M')}>1M</Button>
              <Button className={classNames({ 'active': chartPeriod === "3M" })} onClick={() => onSelectChartPeriod('3M')}>3M</Button>
              <Button className={classNames({ 'active': chartPeriod === "6M" })} onClick={() => onSelectChartPeriod('6M')}>6M</Button>
              <Button className={classNames({ 'active': chartPeriod === "1Y" })} onClick={() => onSelectChartPeriod('1Y')}>1Y</Button>
              <Button className={classNames({ 'active': chartPeriod === "All" })} onClick={() => onSelectChartPeriod('All')}>All</Button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300} className={'chart'}>
            {
              (exerciseChart.data?.repsData && exerciseChart.exerciseId === exercise._id) &&
              <AreaChart
                data={chartDataView === "reps" ? exerciseChart.data?.repsData :  exerciseChart.data?.volData} 
                margin={{
                  right: -7,
                  left: -7,
                  bottom: 5
                }}
              >
                <CartesianGrid strokeDasharray="2 10" stroke="var(--gray)" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                {/* <YAxis /> */}
                {/* <Legend /> */}
                <defs>
                  <linearGradient id="repGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b4c0ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#b4c0ff" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff81af" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff81af" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="reps"
                  stroke="#bdc7f8"
                  fill="url(#repGradient)"
                  activeDot={{ r: 1 }}
                  stackId="1"
                />
                <Area
                  type="monotone"
                  stackId="1"
                  dataKey="vol"
                  stroke="#f791b6"
                  fill="url(#volGradient)"
                />
              </AreaChart>
            }

          </ResponsiveContainer>
        </div>

      </motion.div>

    </motion.div >
  )
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  exercises: selectExerciseList
});


const mapDispatchToProps = dispatch => ({
  createExercise: exercise => dispatch(createExerciseStart(exercise)),
  deleteExercise: exerciseId => dispatch(deleteExerciseStart(exerciseId)),
  getExerciseChartData: chartDataInput => dispatch(getExerciseChardDataStart(chartDataInput))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExerciseInfo);