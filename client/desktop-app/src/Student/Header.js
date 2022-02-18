import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import ReactRoundedImage from "react-rounded-image";
import MyPhoto from './Student3.png';
import GroupAddSharpIcon from '@material-ui/icons/GroupAddSharp';
import VisibilityIcon from '@material-ui/icons/Visibility';
import BorderColorSharpIcon from '@material-ui/icons/BorderColorSharp';
import CreateIcon from '@material-ui/icons/Create';
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';

export default function StudentHeader(props) {
    return (
        <Fragment>
            <nav id="sidebar">
                <div className="sidebar-header">
                    <h3>Student Dashboard</h3>
                    <div style={{ display: "flex" }}>
                    <Link to="/student/studentprofile"> <ReactRoundedImage image={MyPhoto} roundedColor="#9696FF" hoverColor="#CDCDCD" /></Link>
                        
                    </div>
                </div>
                <ul className="list-unstyled components">
                    <li><Link to="/student/viewExam"><CreateIcon /> View Exams</Link></li>
                    <li><Link to="/student/viewresult"><VisibilityIcon /> View Result</Link></li>
                    {/**student/studentprofile */}
                    

                    <li><Link to="/"><ExitToAppTwoToneIcon /> Logout</Link></li>
                </ul>
            </nav>
        </Fragment>
    );
}