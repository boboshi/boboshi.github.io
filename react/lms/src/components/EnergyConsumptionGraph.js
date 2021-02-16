import React from "react";
import {Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import moment from "moment";

function EnergyConsumptionGraph(props)
{
    const oneDTemplate =
    (
        <ResponsiveContainer>
            <AreaChart>
                <defs>
                    <linearGradient id="presentColour" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="25%" stopColor="#2CD9C5" stopOpacity={0.15}/>
                        <stop offset="100%" stopColor="#2CD9C5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="pastColour" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="25%" stopColor="#8C54FF" stopOpacity={0.15}/>
                        <stop offset="100%" stopColor="#8C54FF" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid stroke = "#ccc" strokeDasharray = "5 5"/>
                <XAxis 
                    dataKey = "t"
                    style = {{
                        color: "#6D6E71",
                        fontFamily: "work sans, sans-serif",
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
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
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
                    }}
                    stroke = "#E0E0E0"
                    tick = {{fill: "#6D6E71"}}
                />
                <Tooltip 
                    wrapperStyle = {{
                        color: "#6D6E71",
                        fontFamily: "work sans, sans-serif",
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
                    }}
                    labelFormatter={index => ""}
                />
                <Area 
                    data = {props.data[0]} 
                    type = "line" dataKey = "Present" 
                    stroke = "#2CD9C5" fillOpacity = {1} 
                    fill = "url(#presentColour)" 
                    dot = {{stroke: "#2CD9C5", strokeWidth: 2, fill: "#FFFFFF"}} 
                />
                <Area 
                    data = {props.data[1]} 
                    type = "line" dataKey = "Past" 
                    stroke = "#8C54FF" fillOpacity = {1} 
                    fill = "url(#pastColour)" 
                    dot = {{stroke: "#8C54FF", strokeWidth: 2, fill: "#FFFFFF"}} 
                />
            </AreaChart>
        </ResponsiveContainer>
    );

    const fiveDTemplate =
    (
        <ResponsiveContainer>
            <AreaChart>
                <defs>
                    <linearGradient id="presentColour" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="25%" stopColor="#2CD9C5" stopOpacity={0.15}/>
                        <stop offset="100%" stopColor="#2CD9C5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="pastColour" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="25%" stopColor="#8C54FF" stopOpacity={0.15}/>
                        <stop offset="100%" stopColor="#8C54FF" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid stroke = "#ccc" strokeDasharray = "5 5"/>
                <XAxis 
                    dataKey = "t"
                    style = {{
                        color: "#6D6E71",
                        fontFamily: "work sans, sans-serif",
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
                    }}
                    axisLine = {false}
                    tickLine = {false}
                    type = "number"
                    domain = {[1, 5]}
                    ticks = {[1, 2, 3, 4, 5]}
                />
                <YAxis 
                    style = {{
                        color: "#6D6E71",
                        fontFamily: "work sans, sans-serif",
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
                    }}
                    stroke = "#E0E0E0"
                    tick = {{fill: "#6D6E71"}}
                />
                <Tooltip 
                    wrapperStyle = {{
                        color: "#6D6E71",
                        fontFamily: "work sans, sans-serif",
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
                    }}
                    labelFormatter={index => ""}
                />
                <Area 
                    data = {props.data[2]} 
                    type = "line" dataKey = "Present" 
                    stroke = "#2CD9C5" fillOpacity = {1} 
                    fill = "url(#presentColour)" 
                    dot = {{stroke: "#2CD9C5", strokeWidth: 2, fill: "#FFFFFF"}} 
                />
                <Area 
                    data = {props.data[3]} 
                    type = "line" dataKey = "Past" 
                    stroke = "#8C54FF" fillOpacity = {1} 
                    fill = "url(#pastColour)" 
                    dot = {{stroke: "#8C54FF", strokeWidth: 2, fill: "#FFFFFF"}} 
                />
            </AreaChart>
        </ResponsiveContainer>
    );

    const oneMTemplate =
    (
        <ResponsiveContainer>
            <AreaChart>
                <defs>
                    <linearGradient id="presentColour" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="25%" stopColor="#2CD9C5" stopOpacity={0.15}/>
                        <stop offset="100%" stopColor="#2CD9C5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="pastColour" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="25%" stopColor="#8C54FF" stopOpacity={0.15}/>
                        <stop offset="100%" stopColor="#8C54FF" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid stroke = "#ccc" strokeDasharray = "5 5"/>
                <XAxis 
                    dataKey = "t"
                    style = {{
                        color: "#6D6E71",
                        fontFamily: "work sans, sans-serif",
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
                    }}
                    axisLine = {false}
                    tickLine = {false}
                    type = "number"
                    domain = {[1, 4]}
                    ticks = {[1, 2, 3, 4]}
                />
                <YAxis 
                    style = {{
                        color: "#6D6E71",
                        fontFamily: "work sans, sans-serif",
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
                    }}
                    stroke = "#E0E0E0"
                    tick = {{fill: "#6D6E71"}}
                />
                <Tooltip 
                    wrapperStyle = {{
                        color: "#6D6E71",
                        fontFamily: "work sans, sans-serif",
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
                    }}
                    labelFormatter={index => ""}
                />
                <Area 
                    data = {props.data[4]} 
                    type = "line" dataKey = "Present" 
                    stroke = "#2CD9C5" fillOpacity = {1} 
                    fill = "url(#presentColour)" 
                    dot = {{stroke: "#2CD9C5", strokeWidth: 2, fill: "#FFFFFF"}} 
                />
                <Area 
                    data = {props.data[5]} 
                    type = "line" dataKey = "Past" 
                    stroke = "#8C54FF" fillOpacity = {1} 
                    fill = "url(#pastColour)" 
                    dot = {{stroke: "#8C54FF", strokeWidth: 2, fill: "#FFFFFF"}} 
                />
            </AreaChart>
        </ResponsiveContainer>
    );

    const oneYTemplate =
    (
        <ResponsiveContainer>
            <AreaChart>
                <defs>
                    <linearGradient id="presentColour" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="25%" stopColor="#2CD9C5" stopOpacity={0.15}/>
                        <stop offset="100%" stopColor="#2CD9C5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="pastColour" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="25%" stopColor="#8C54FF" stopOpacity={0.15}/>
                        <stop offset="100%" stopColor="#8C54FF" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid stroke = "#ccc" strokeDasharray = "5 5"/>
                <XAxis 
                    dataKey = "t"
                    style = {{
                        color: "#6D6E71",
                        fontFamily: "work sans, sans-serif",
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
                    }}
                    axisLine = {false}
                    tickLine = {false}
                    type = "number"
                    domain = {[1, 12]}
                    ticks = {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
                />
                <YAxis 
                    style = {{
                        color: "#FFFFFF",
                        fontFamily: "work sans, sans-serif",
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
                    }}
                    stroke = "#FFFFFF"
                    tick = {{fill: "#FFFFFF"}}
                />
                <Tooltip 
                    wrapperStyle = {{
                        color: "#6D6E71",
                        fontFamily: "work sans, sans-serif",
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
                    }}
                    labelFormatter={index => ""}
                />
                <Area 
                    data = {props.data[6]} 
                    type = "line" dataKey = "Present" 
                    stroke = "#2CD9C5" fillOpacity = {1} 
                    fill = "url(#presentColour)" 
                    dot = {{stroke: "#2CD9C5", strokeWidth: 2, fill: "#FFFFFF"}} 
                />
                <Area 
                    data = {props.data[7]} 
                    type = "line" dataKey = "Past" 
                    stroke = "#8C54FF" fillOpacity = {1} 
                    fill = "url(#pastColour)" 
                    dot = {{stroke: "#8C54FF", strokeWidth: 2, fill: "#FFFFFF"}} 
                />
            </AreaChart>
        </ResponsiveContainer>
    );

    const threeYTemplate =
    (
        <ResponsiveContainer>
            <AreaChart>
                <defs>
                    <linearGradient id="presentColour" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="25%" stopColor="#2CD9C5" stopOpacity={0.15}/>
                        <stop offset="100%" stopColor="#2CD9C5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="pastColour" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="25%" stopColor="#8C54FF" stopOpacity={0.15}/>
                        <stop offset="100%" stopColor="#8C54FF" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid stroke = "#ccc" strokeDasharray = "5 5"/>
                <XAxis 
                    dataKey = "t"
                    style = {{
                        color: "#6D6E71",
                        fontFamily: "work sans, sans-serif",
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
                    }}
                    axisLine = {false}
                    tickLine = {false}
                    type = "number"
                    domain = {[1, 3]}
                    ticks = {[1, 2, 3]}
                />
                <YAxis 
                    style = {{
                        color: "#6D6E71",
                        fontFamily: "work sans, sans-serif",
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
                    }}
                    stroke = "#E0E0E0"
                    tick = {{fill: "#6D6E71"}}
                />
                <Tooltip 
                    wrapperStyle = {{
                        color: "#6D6E71",
                        fontFamily: "work sans, sans-serif",
                        fontSize: "max(0.572vw, 8.247px)",
                        fontWeight: "400",
                    }}
                    labelFormatter={index => ""}
                />
                <Area 
                    data = {props.data[8]} 
                    type = "line" dataKey = "Present" 
                    stroke = "#2CD9C5" fillOpacity = {1} 
                    fill = "url(#presentColour)" 
                    dot = {{stroke: "#2CD9C5", strokeWidth: 2, fill: "#FFFFFF"}} 
                />
                <Area 
                    data = {props.data[9]} 
                    type = "line" dataKey = "Past" 
                    stroke = "#8C54FF" fillOpacity = {1} 
                    fill = "url(#pastColour)" 
                    dot = {{stroke: "#8C54FF", strokeWidth: 2, fill: "#FFFFFF"}} 
                />
            </AreaChart>
        </ResponsiveContainer>
    );

    return(
        <div className = "dashboard-page-view-energy-graph-container">
            {props.data && props.option === "1D" && oneDTemplate}
            {props.data && props.option === "5D" && fiveDTemplate}
            {props.data && props.option === "1M" && oneMTemplate}
            {props.data && props.option === "1Y" && oneYTemplate}
            {props.data && props.option === "3Y" && threeYTemplate}
        </div>
    );
}

export default EnergyConsumptionGraph;