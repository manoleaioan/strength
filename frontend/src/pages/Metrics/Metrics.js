import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectMetrics } from '../../redux/metrics/metrics.selectors';
import { getMetricsStart } from '../../redux/metrics/metrics.actions';
import { Button, MenuItem, Select } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ArrowForwardIos } from '@mui/icons-material';
import PieChartCard from '../../components/PieChartCard/PieChartCard';
import { MotionNumber } from '../../components/MotionNumber/MotionNumber';
import "./Metrics.scss";
import classNames from 'classnames';
import { motion } from 'framer-motion';

const Metrics = ({ metrics, metrics: { isLoading }, getMetrics }) => {
  const [errors, setErrors] = useState();
  const [dates, setDates] = useState([]);
  const [date, setDate] = useState({ value: '' });
  const { workouts = 0, exercises = 0, sets = 0, reps = 0 } = metrics.data.general;



  useEffect(() => {
    const currentDate = dayjs();

    const generatedDates = [];

    for (let i = 0; i <= 12; i++) {
      const date = currentDate.subtract(i, 'month').date(1);
      generatedDates.push({
        value: date.format('MMMM YYYY'),
        gt: date.startOf('month').toISOString(),
        lte: date.endOf('month').toISOString(),
      });
    }

    const allDates = [
      {
        value: "All time",
        gt: "2024-01-01T00:00:00.000Z"
      },
      {
        value: "Year",
        gt: dayjs().year(currentDate.year()).startOf('year').toISOString(),
        lte: dayjs().year(currentDate.year()).endOf('year').toISOString(),
      },
      {
        value: "6 months",
        gt: currentDate.subtract(6, 'month').startOf('day').toISOString()
      },
      {
        value: "3 months",
        gt: currentDate.subtract(3, 'month').startOf('day').toISOString()
      },
      {
        value: "1 month",
        gt: currentDate.subtract(1, 'month').startOf('day').toISOString()
      },
      {
        value: (currentDate.year() - 1).toString(),
        gt: dayjs().year(currentDate.year() - 1).startOf('year').toISOString(),
        lte: dayjs().year(currentDate.year() - 1).endOf('year').toISOString(),
      },
      {
        value: (currentDate.year() - 2).toString(),
        gt: dayjs().year(currentDate.year() - 2).startOf('year').toISOString(),
        lte: dayjs().year(currentDate.year() - 2).endOf('year').toISOString(),
      },
      ...generatedDates
    ]

    setDates(allDates);

    setDate(allDates[7]);
  }, []);

  useEffect(() => {
    if (date.value != '') {
      getMetrics({ gt: date.gt, lte: date.lte });
      console.log(date)
    }
  }, [date])

  const handleChange = (event) => {
    console.log(event.target.value)
    setDate(dates.find(d => d.value === event.target.value));
  };

  const switchDate = (direction) => {
    let currentIndex = dates.findIndex(d => d.value === date.value);
    let newIndex;

    if (direction === "prev") {
      newIndex = currentIndex === 0 ? dates.length - 1 : currentIndex - 1;
    } else if (direction === "next") {
      newIndex = currentIndex === dates.length - 1 ? 0 : currentIndex + 1;
    }

    setDate(dates[newIndex]);
  }

  return (
    <div className="metrics-container">
      <div className="header sticky">
        <div id="title">
          <Button className="btn-left" onClick={() => switchDate("prev")}><ArrowBackIosIcon /></Button>
          <Select
            classes={{ root: 'date-select-root' }}
            MenuProps={{
              classes: { paper: 'date-select-paper' }
            }}
            id="date-select"
            value={date.value}
            onChange={(handleChange)}
          >
            {dates.map(d => <MenuItem key={d.value} value={d.value}>{d.value}</MenuItem>)}
          </Select>
          <Button className="btn-right" onClick={() => switchDate("next")}><ArrowForwardIos /></Button>
        </div>
      </div>

      <motion.div layout="position" className="charts">
        <div className="chart-section">
          <div className="category">
            General
          </div>
        
            <div className={classNames({ 'skeleton': isLoading && 1==2}, "general")}>
              <div className="record rec">
                <h1 className='rec'>
                  <MotionNumber value={workouts} inView={false} />
                </h1>
                <span>Workouts</span>
              </div>
              <div className="record ex">
                <h1 className='ex'>
                  <MotionNumber value={exercises} inView={false} />
                </h1>
                <span>Exercises</span>
              </div>
              <div className="record sets">
                <h1 className='sets'>
                  <MotionNumber value={sets} inView={false} />
                </h1>
                <span>Sets</span>
              </div>
              <div className="record reps">
                <h1 className='reps'>
                  <MotionNumber value={reps} inView={false} />
                </h1>
                <span>Reps</span>
              </div>
            </div>
          
        </div>

        <div className="chart-section">
          <div className="category">ROUTINES</div>
          <PieChartCard name="routine" data={metrics.data.routines} loading={isLoading} />
        </div>

        <div className="chart-section">
          <div className="category">EXERCISES</div>
          <PieChartCard name="exercise" data={metrics.data.exercises} loading={isLoading} />
        </div>
      </motion.div>

    </div >
  )
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser,
  metrics: selectMetrics
});

const mapDispatchToProps = dispatch => ({
  getMetrics: date => dispatch(getMetricsStart(date)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Metrics);