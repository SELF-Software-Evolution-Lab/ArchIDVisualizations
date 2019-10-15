import React, {Component, Fragment} from 'react';
import {Doughnut, Line} from 'react-chartjs-2';
import * as d3 from "d3";

class History extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.renderHistory();
        this.renderIssues()
    }


    renderHistory() {
        let data = {
            datasets: []
        };
        const options = {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of architectural issues'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    },
                    type: 'time',
                    distribution: 'linear',
                    time: {
                        unit: 'month'
                    }
                }]
            }
        };
        const d = this.props.history[0].data.sort((a, b) => new Date(b.date) - new Date(a.date)).map(c => ({
            x: Date.parse(c.date),
            y: c.issues.reduce((a, b) => a + b, 0)
        }));
        data.datasets.push({
            label: this.props.history[0].name,
            fill: false,
            lineTension: 0,
            backgroundColor: "rgb(204,41,41)",
            borderColor: "rgb(204,41,41)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgb(204,41,41)",
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgb(204,41,41)",
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: d
        });
        this.setState({
            data: data,
            options: options
        });
    }

    renderIssues() {
        const sortedData = this.props.history[0].data.sort((a, b) => new Date(b.date) - new Date(a.date));
        const issues = sortedData[sortedData.length - 1].issues;
        let rules = this.props.categorization.decisions.map(d => d.rules);
        rules = [].concat.apply([], rules).sort((a, b) => a.id - b.id).map(r => r.title);
        const backgroundColors = d3.schemeSet1.concat(d3.schemeSet2);
        let stats = {
            labels: rules,
            datasets: [{
                data: issues,
                backgroundColor: backgroundColors
            }]
        };
        this.setState({
            issues: stats
        });
    }

    render() {
        const {data, options, issues} = this.state;
        return (
            <div className={"row"}>
                {data && options ?
                    <Fragment>
                        <h1 className="text-center col-md-12">Issues history for the project</h1>
                        <Line data={data} options={options}/>
                        <h1 className="text-center col-md-12">Most common violations in latest release</h1>
                        <Doughnut data={issues}/>
                    </Fragment> : ""}
            </div>

        )
    }
}

export default History;