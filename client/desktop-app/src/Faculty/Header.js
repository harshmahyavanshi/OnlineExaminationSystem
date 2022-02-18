import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import ReactRoundedImage from "react-rounded-image";
import MyPhoto from "./Faculty.png";
import AddBoxIcon from '@material-ui/icons/AddBox';
import CreateIcon from '@material-ui/icons/Create';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BackupOutlinedIcon from '@material-ui/icons/BackupOutlined';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
export default function FacultyHeader(props) {
    return (
        <Fragment>
            <nav id="sidebar">
                <div className="sidebar-header">
                    <h3>Faculty Dashboard</h3>
                    <div style={{ display: "flex" }}>
                      <Link to="/faculty/facultyProfile"> <ReactRoundedImage image={MyPhoto} roundedColor="#D1D0CE" hoverColor="#4863A0" /></Link> 
                    </div>
                </div>
                <ul className="list-unstyled components">
                    <li><Link to="/faculty/viewExam"><CreateIcon /> View Created Exams</Link></li>
                    <li><Link to="/faculty/createExam"><AddCircleOutlineOutlinedIcon /> Create Exam</Link></li>
                    <li><Link to="/faculty/uploadresult"><BackupOutlinedIcon /> Upload Result</Link></li>
                    <li><Link to="/"><ExitToAppIcon /> Logout</Link></li>
                </ul>
            </nav>
        </Fragment>
    );
}