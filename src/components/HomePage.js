import React, {Component} from 'react';
import '../styles/App.css';
import {getCategorization, getIssueDetail, getProjects} from '../api';
import Select from 'react-select';
import Structure from "./Structure";
import Metrics from "./Metrics";
import Rules from "./Rules";
import Issues from "./Issues";


class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.setViz = this.setViz.bind(this);
    }

    componentDidMount() {
        getProjects().then(projects => {
            projects = projects.filter(p => p.name === "DemoProyectoJava");
            let options = projects.map(project => {
                    return {value: project, label: project.name}
                }
            );
            this.setState({projects, options, currentProject: options[0], showing: 1}, this.getCats)
        })
    }

    getCats() {
        getCategorization().then(projects => {
            this.setState({
                categorization: projects,
                currentCategorization: projects.find(c => c.name === this.state.currentProject.label) || projects[0]
            }, this.getDetail)
        })
    }

    getDetail() {
        getIssueDetail().then(issues => {
            this.setState({
                issues
            })
        })
    }

    handleChange(currentProject) {
        let currentCategorization = this.state.categorization.find(c => c.name === currentProject.label) || this.state.categorization[0];
        this.setState({
            currentProject: currentProject,
            currentCategorization
        })
    }

    setViz(i) {
        this.setState({showing: i})
    }

    render() {
        const {currentProject, options, categorization, currentCategorization, issues, showing} = this.state;
        return (
            <div className="container">
                <h1>ArchID</h1>
                <button type="button" className="btn btn-outline-info" onClick={() => this.setViz(1)}>Metrics
                </button>
                <button type="button" className="btn btn-outline-info" onClick={() => this.setViz(2)}>Structure
                </button>
                <button type="button" className="btn btn-outline-info" onClick={() => this.setViz(3)}>Rules
                </button>
                <button type="button" className="btn btn-outline-info" onClick={() => this.setViz(4)}>Issues
                </button>
                {options && categorization && issues && showing ?
                    <div className="row">
                        <h4 className="col-md-2">Project</h4>
                        <div className="col-md-6">
                            <Select
                                value={currentProject}
                                onChange={this.handleChange}
                                options={options}
                                defaultValue={options[0]}
                            />
                        </div>
                    </div> : ''}
                {currentProject && categorization && issues && showing && showing === 1 ?
                    <Metrics categorization={currentCategorization} key={currentProject.label + showing}
                             issues={issues} projectData={currentProject}/> : ''}
                {currentProject && categorization && issues && showing && showing === 2 ?
                    <Structure categorization={currentCategorization} key={currentProject.label + showing}
                               issues={issues} projectData={currentProject}/> : ''}
                {currentProject && categorization && issues && showing && showing === 3 ?
                    <Rules categorization={currentCategorization} key={currentProject.label + showing}
                           issues={issues} projectData={currentProject}/> : ''}
                {currentProject && categorization && issues && showing && showing === 4 ?
                    <Issues categorization={currentCategorization} key={currentProject.label + showing}
                            issues={issues} projectData={currentProject}/> : ''}
            </div>
        );
    }
}

export default HomePage;