import React from "react";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DateCalendar } from "@mui/x-date-pickers";
import { Whatshot } from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import { DayCalendarSkeleton, PickersDay } from '@mui/x-date-pickers';
import classNames from 'classnames';
import { ThemeProvider,createTheme } from "@mui/material";

import "./Calendar.scss";

dayjs.extend(utc);



function ServerDay(props) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const dayDate = day.format('YYYY-MM-DD');

  const isSelected = !props.outsideCurrentMonth && highlightedDays.days?.some(date => (dayjs(date)).format('YYYY-MM-DD') === dayDate);

  const badge = () => {
    if (isSelected)
      return <Whatshot sx={{ mr: 0.5 }} fontSize="inherit" className='calendar-badge' />
    else if (day < Date.now() && !props.outsideCurrentMonth) {
      // return <Battery1Bar sx={{ mr: 0.5 }} fontSize="inherit" className='calendar-badge battery' />
    }
  }

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      className={classNames({
        'day-selected': isSelected
      })}
      badgeContent={badge()}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      {/* 
      {
        isSelected && 
        <div className='calendar-badge2'><Whatshot sx={{ mr: 0.5 }} fontSize="inherit" className='calendar-badge' /></div>
      } */}
    </Badge>
  );
}


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

const Calendar = ({ date, highlightedDays, ...props }) => {
  return <ThemeProvider theme={theme}>
    <DateCalendar
      className="MuiDayCalendar-header MuiDayCalendar-weekContainer"
      renderLoading={() => <DayCalendarSkeleton />}
      slots={{
        day: ServerDay,
      }}
      slotProps={{
        day: {
          highlightedDays
        },
      }}
      {...props}
    />
  </ThemeProvider>
}

export default Calendar;