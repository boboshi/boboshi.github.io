import React from "react";
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import moment from "moment";

function EnergyConsumptionGraph(props)
{
    return(
        <div className = "dashboard-page-view-energy-graph-container">
            {props.data &&
                <ResponsiveContainer>
                    <LineChart>
                        <Line data = {props.data[0]} type = "line" dataKey = "Present" stroke = "#2CD9C5"/>
                        <Line data = {props.data[1]} type = "line" dataKey = "Past" stroke = "#8C54FF"/>
                        <CartesianGrid stroke = "#ccc" strokeDasharray = "5 5"/>
                        <XAxis 
                            dataKey = "t"
                            style = {{
                                color: "#6D6E71",
                                fontFamily: "work sans, sans-serif",
                                fontSize: "max(0.7vw, 10.08px)",
                                fontWeight: "500",
                                letterSpacing: "0.05em"
                            }}
                            axisLine = {false}
                            tickLine = {false}
                            type = "number"
                            domain = {[59400, 145800]}
                            tickFormatter = {(tick) => moment(tick * 1000).format('HH:mm')}
                            ticks = {[59400, 73800, 88200, 102600, 117000, 131400, 145800]}
                        />
                        <YAxis 
                            style = {{
                                color: "#6D6E71",
                                fontFamily: "work sans, sans-serif",
                                fontSize: "max(0.7vw, 10.08px)",
                                fontWeight: "500",
                                letterSpacing: "0.05em"
                            }}
                            stroke = "#E0E0E0"
                            tick = {{fill: "#6D6E71"}}
                        />
                        <Tooltip 
                            wrapperStyle = {{
                                color: "#6D6E71",
                                fontFamily: "work sans, sans-serif",
                                fontSize: "max(0.7vw, 10.08px)",
                                fontWeight: "500",
                                letterSpacing: "0.05em"
                            }}
                            labelFormatter={index => ""}
                        />
                    </LineChart>
                </ResponsiveContainer>
            }
        </div>
    );
}

export default EnergyConsumptionGraph;