import React from "react";

class Timestamp extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            year: new Date().getFullYear().toString(),
            month: "0" + (new Date().getMonth() + 1).toString(),
            day: "0" + new Date().getDate().toString(),
            hour: "0" + new Date().getHours().toString(),
            minute: "0" + new Date().getMinutes().toString(),
            second: "0" + new Date().getSeconds().toString()
        };
    }

    componentDidMount() 
    {
        this.intervalID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() 
    {
        clearInterval(this.intervalID);
    }

    tick() 
    {
        this.setState
        ({
            year: new Date().getFullYear().toString(),
            month: "0" + (new Date().getMonth() + 1).toString(),
            day: "0" + new Date().getDate().toString(),
            hour: "0" + new Date().getHours().toString(),
            minute: "0" + new Date().getMinutes().toString(),
            second: "0" + new Date().getSeconds().toString()
        });
    }

    render() 
    {
      return (
        <div>
            <h1 className = "dashboard-page-sidebar-bottomtext-timestamptext">
                {this.state.day.slice(-2)}-{this.state.month.slice(-2)}-{this.state.year.slice(-2)}
            </h1>
            <h1 className = "dashboard-page-sidebar-bottomtext-timestamptext">
                {this.state.hour.slice(-2)}:{this.state.minute.slice(-2)}:{this.state.second.slice(-2)}
            </h1>
        </div>
      );
    }
}

export default Timestamp;