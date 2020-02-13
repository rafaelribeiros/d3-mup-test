import React, { useRef, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import * as d3 from "d3";

import { generateRandomNumbers } from "../const/functions";
import { DATA } from "../const/data";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  card: {
    padding: theme.spacing(1),
    margin: theme.spacing(2)
  },
  inputContainer: {
    paddingBottom: theme.spacing(3)
  }
}));

export function BarGraph() {
  const classes = useStyles();
  const [seedValue, setSeedValue] = useState(5);
  const [range] = useState({ min: -10, max: 90 });
  const [marginLeft] = useState(30);
  const [height] = useState(500);
  const [width] = useState(DATA.length * 40);
  const ref = useRef();

  const handleChange = event => {
    const value = event.target.value;

    const inRange = value >= 0 && value <= 10;

    if (!value || inRange) setSeedValue(value);

    if (value && inRange) {
      updateData(parseInt(value));
    }
  };

  useEffect(() => {
    const charts = [
      ...DATA.map((item, index) => {
        const chart = Object.assign({}, item);
        chart.value = generateRandomNumbers(range, seedValue, index);
        return chart;
      })
    ];

    const svgElement = d3
      .select(ref.current)
      .attr("viewBox", `0 0 ${width} ${height + 60}`);

    const { xAxis, xScale } = getXAxis(charts);
    const { yAxis, yScale } = getYAxis(charts);

    const rects = svgElement
      .append("g")
      .attr("fill", "teal")
      .selectAll("rect")
      .data(charts)
      .enter()
      .append("rect")
      // This part was based on the example (bandwidth)
      .attr("width", xScale.bandwidth())
      .attr("x", function(d) {
        return xScale(d.title);
      })
      .attr("y", () => {
        return height;
      });

    renderXAxis(xAxis, svgElement);
    renderYAxis(yAxis, svgElement);

    rects
      .transition()
      .duration(1000)
      .attr("height", d => {
        return Math.abs(yScale(d.value));
      })
      .attr("y", d => {
        return height - Math.max(0, yScale(d.value));
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getXAxis = values => {
    const xScale = d3
      // This part was based on the example (scaleBand)
      .scaleBand()
      .domain(values.map(d => d.title))
      .range([marginLeft, width])
      .padding(0.2);

    return { xAxis: d3.axisBottom(xScale).tickSize(0), xScale };
  };

  const renderXAxis = (xAxis, svg) => {
    svg
      .append("g")
      .attr("class", "xAxis")
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
      .attr("class", "yAxis")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis);
  };

  const updateData = seed => {
    const charts = [
      ...DATA.map((item, index) => {
        const chart = Object.assign({}, item);
        chart.value = generateRandomNumbers(range, seed, index);
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
      .attr("y", d => {
        return height - Math.max(0, yScale(d.value));
      });
  };

  return (
    <div className={classes.root}>
      <Grid item xs={12} sm={10} md={10} lg={8}>
        <Card className={classes.card}>
          <CardContent>
            <div className={classes.inputContainer}>
              <Typography variant="h6" gutterBottom>
                Please, kindly enter a number between 0 and 10
              </Typography>
              <TextField
                variant="outlined"
                onChange={handleChange}
                value={seedValue}
                id="seed"
                label="Seed"
                type="number"
                margin="dense"
              />
            </div>
            <svg ref={ref} />
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}
