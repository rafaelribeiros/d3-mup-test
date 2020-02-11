import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import * as d3 from "d3";

import { generateRandomNumbers } from "../const/functions";
import { DATA } from "../const/data";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    padding: theme.spacing(2),
    margin: theme.spacing(4)
  }
}));

export function BarGraph() {
  const classes = useStyles();
  const [seedValue, setSeedValue] = useState(5);
  const [marginLeft] = useState(50);
  const [items] = useState(DATA);
  const [height] = useState(500);
  const [width] = useState(items.length * 40 + 10);
  const ref = useRef();

  const handleChange = event => {
    const value = event.target.value;
    setSeedValue(value);
    if (value) {
      updateData(value);
    }
  };

  const getXAxis = values => {
    const xScale = d3
      .scaleBand()
      .domain(values.map(d => d.title))
      .range([marginLeft, width - 0])
      .padding(0.1);

    return { xAxis: d3.axisBottom(xScale).tickSize(0), xScale };
  };

  const renderXAxis = (xAxis, svg) => {
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);
  };

  const getYAxis = values => {
    var yScale = d3
      .scaleLinear()
      .domain([0, d3.max(values.map(d => d.value))])
      .range([0, height]);

    const yAxisScale = d3
      .scaleLinear()
      .domain([
        d3.min(values.map(d => d.value)),
        d3.max(values.map(d => d.value))
      ])
      .range([height - yScale(d3.min(values.map(d => d.value))), 0]);
    return { yAxis: d3.axisLeft(yAxisScale), yScale };
  };

  const renderYAxis = (yAxis, svg) => {
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis);
  };

  const updateData = seed => {
    const charts = [
      ...DATA.map(item => {
        const chart = Object.assign({}, item);
        chart.value = generateRandomNumbers(90, -11, seed);
        return chart;
      })
    ];
    const { yScale } = getYAxis(charts);
    const svgElement = d3.select(ref.current);

    svgElement
      .selectAll("rect")
      .data(charts)
      .transition()
      .duration(1000)
      .attr("height", d => {
        return Math.abs(yScale(d.value));
      })
      .attr("y", (d, i) => {
        return height - Math.max(0, yScale(d.value));
      });
    // .attr("x", (d, i) => {
    //   return marginLeft + i * 40;
    // });
  };

  useEffect(() => {
    const charts = [
      ...DATA.map(item => {
        const chart = Object.assign({}, item);
        chart.value = generateRandomNumbers(90, -11, seedValue);
        return chart;
      })
    ];

    const svgElement = d3
      .select(ref.current)
      .attr("class", "axis")
      .attr("width", width)
      .attr("height", height + 100);

    const { xAxis, xScale } = getXAxis(charts);
    const { yAxis, yScale } = getYAxis(charts);

    const rects = svgElement
      .append("g")
      .attr("fill", "teal")
      .selectAll("rect")
      .data(charts)
      .enter()
      .append("rect")
      .attr("width", xScale.bandwidth())
      .attr("x", function(d) {
        return xScale(d.title);
      })
      .attr("y", d => {
        return height;
      })
      .attr("height", 0);

    renderXAxis(xAxis, svgElement);
    renderYAxis(yAxis, svgElement);

    rects
      .transition()
      .duration(1000)
      .attr("height", d => {
        return Math.abs(yScale(d.value));
      })
      .attr("y", (d, i) => {
        return height - Math.max(0, yScale(d.value));
      })
      .attr("x", (d, i) => {
        return marginLeft + i * 40;
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <div className={classes.container}>
          <Typography variant="h6" gutterBottom>
            Please, choose a number between 0 and 10
          </Typography>
          <TextField
            onChange={handleChange}
            value={seedValue}
            id="standard-basic"
            label="Seed"
            type="number"
            InputProps={{ inputProps: { min: 0, max: 10 } }}
          />
        </div>
        <svg ref={ref} />
      </Container>
    </div>
  );
}
