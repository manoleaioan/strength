import React, { useEffect, useRef, useState } from 'react';
import { PieChart, Pie, Cell, Sector } from "recharts";
import { MotionNumber } from '../../components/MotionNumber/MotionNumber';
import classNames from 'classnames';

import './PieChartCard.scss';
import { motion } from 'framer-motion';
import { generateRandomColor } from '../../helpers/colorUtils.js';

const PieChartCard = ({ name, chartData = [], loading }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const rowsRef = useRef(null);
  const [data, setData] = useState([]);

  const onPieEnter = (props, index, e) => {
    e.stopPropagation();
    setActiveIndex(index);

    const rows = rowsRef.current;
    let selectedRow = rows.querySelector(`.data-row-${index}`);

    let scrollPosition = selectedRow.offsetTop - rows.offsetTop;
    rows.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
  };

  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + innerRadius) / 2 * cos; // Calculate midpoint x-coordinate
    const my = cy + (outerRadius + innerRadius) / 2 * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius - 5}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke={fill}
        />
        {/* <text x={mx} y={my} fill="white" textAnchor={"middle"} dominantBaseline="central">
          {`${(value)}%`}
        </text> */}
      </g>
    );
  };

  useEffect(() => {
    setActiveIndex(null);
    setData(chartData);
  }, [chartData])

  return <motion.div layout='position'
    className={classNames({ 'noselect': data.length === 0 }, "pie-chart-card-container chart exercises")}
    onClick={() => setActiveIndex(null)}
  >
    <div className='chart-wrapper'>
      <PieChart width={220} height={220} className='pie-chart'>
        <defs>
          {data.map((entry, index) => {
            if (!entry.color) {
              entry.color = generateRandomColor();
            }
            return (
              <linearGradient id={`gradient-${name}-${index}`} key={`gradient-${name}-${index}`}>
                <stop offset="0%" stopColor={`${entry.color}69`} />
                <stop offset="100%" stopColor={entry.color} />
              </linearGradient>
            )
          })}
        </defs>
        <Pie
          data={data.length === 0 ? [{ name: '', val: 1 }] : data}
          dataKey="val"
          innerRadius={"70%"}
          outerRadius={"100%"}
          animationDuration={2000}
          paddingAngle={0}
          animationBegin={0}
          isAnimationActive={data.length !== 0}
          onClick={(props, i, e) => data.length !== 0 && onPieEnter(props, i, e)}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`}
              outerRadius={"40%"}
              fill={`url(#gradient-${name}-${index})`}
              // fill={entry.color}
              stroke={0}
            />
          ))}

          {data.length === 0 &&
            <Cell key={`cell`}
              outerRadius={"40%"}
              fill={'var(--metrics-no-data-color)'}
              stroke={0}
            />}
        </Pie>
      </PieChart>

      <div className="total" style={{ display: 'flex' }}>
        <span>
          <MotionNumber value={data.length} inView={false} />
        </span>
        <span className='name'>
          {name}{data.length !== 1 && 's'}
        </span>
      </div>
    </div>

    <div className="data-wrapper">
      <motion.div layout className="data" transition={{type:'ease'}}>

        <div className="row row-header transparent-scrollbar">
          <div className="name">
            <div className="bullet"></div>
          </div>
          <div className="value">
            {/* debug only */}
            {/* {data.reduce((previousValue, c) => previousValue + c.val, 0)} */}
            %
          </div>
        </div>


        <motion.div layout='position' ref={rowsRef} className="rows">
          {
            [
              ...data,
            ]
              .map((r, i) => (
                <div key={`${r.name}-${i}`} className={`row data-row-${i}`}
                  onClick={(e) => r.val !== '-' && onPieEnter({ name: r.name }, i, e)}
                  style={{
                    color: r.color,
                    background: activeIndex === i ? `linear-gradient(270deg, transparent 10%, ${r.color}50 50%, transparent 100%` : 'transparent'
                  }}>
                  <div className="name">
                    <div className="bullet" style={{ boxShadow: `-4px 0 4px 0 ${r.color}30`, backgroundColor: r.color }}></div>
                    {r.name}
                  </div>
                  <div className="value">{r.val}%</div>
                </div>
              ))
          }
        </motion.div>
      </motion.div>
    </div>

  </motion.div>
};

export default PieChartCard