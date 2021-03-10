import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import moment from "moment";

import { displayAmount } from "../utils";
import { ethers } from "ethers";

const VestingChart = ({ details }) => {
  function chartData() {
    return {
      datasets: [
        fromBaseDataset({
          data: getPoints(),
        }),
      ],
    };
  }

  function getPoints() {
    const { start, cliff, end } = details;
    const now = ethers.BigNumber.from(Math.floor(new Date() / 1000)); // normalize to seconds

    const points = [getDataPointAt(start)];

    // Add signitificant datapoints. Order matters.
    if (cliff.lt(now)) {
      points.push(getDataPointAt(cliff));
    }

    if (start.lt(now) && now.lt(end)) {
      points.push(getDataPointAt(now));
    }

    if (cliff.gt(now)) {
      points.push(getDataPointAt(cliff));
    }

    points.push(getDataPointAt(end));

    return points;
  }

  function getDataPointAt(date) {
    return {
      x: formatDate(date),
      y: getAmountAt(date),
    };
  }

  function formatDate(date) {
    return moment(date * 1000).format("MM/DD/YYYY HH:mm");
  }

  function getAmountAt(date) {
    const { total, start, end, decimals } = details;
    const slope = date.sub(start).div(end.sub(start));

    return ethers.BigNumber.from(displayAmount(total, decimals))
      .mul(slope)
      .toString();
  }

  function chartOptions() {
    return {
      legend: { display: false },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              format: "MM/DD/YYYY HH:mm",
              tooltipFormat: "ll HH:mm",
            },
            scaleLabel: {
              display: true,
              labelString: "Date",
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: details.symbol || "",
            },
          },
        ],
      },
    };
  }

  function fromBaseDataset(opts) {
    return {
      lineTension: 0.1,
      backgroundColor: "rgba(92,182,228,0.4)",
      borderColor: "rgba(92,182,228,1)",
      borderJoinStyle: "miter",
      pointBorderColor: "rgba(92,182,228,1)",
      pointBackgroundColor: "rgba(92,182,228,1)",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(92,182,228,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 5,
      pointHitRadius: 10,
      ...opts,
    };
  }

  return <Line data={chartData()} options={chartOptions()} />;
};

export default VestingChart;
