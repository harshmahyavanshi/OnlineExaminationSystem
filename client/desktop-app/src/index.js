import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AdminDashboard from "./Admin/AdminDashboard"
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Switch, withRouter } from "react-router-dom";
import AddAdmins from './Admin/AddAdmins';
import AddFaculties from './Admin/AddFaculties';
import AddStudent from './Admin/AddStudents';
import DIsplayAdmins from './Admin/DisplayAdmin';
import DisplayStudents from './Admin/DisplayStudents';
import DisplayFaculties from './Admin/DisplayFaculties';
import FacultyDashboard from './Faculty/FacultyDashboard';
import ViewExams from './Faculty/ViewExam';
import CreateExam from './Faculty/CreateExam';
import ViewExamss from './Student/ViewExam';
import StudentDashboard from './Student/StudentDashboard';
import NotFound from './NotFound';
import Pdf from './Student/Written';
import ViewResponse  from './Faculty/ViewResponse'
import ShowAnswersheet from './Faculty/ShowAnwersheet'
import UploadResult from './Faculty/UploadResult'
import ViewResult from './Student/ViewResult'
import Forgotpassword from './forgotpassword';
import StudentProfile from './Student/Profile'
import AdminProfile from './Admin/Profile'
import FacultyProfile from './Faculty/Profile'
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
        <div className="App">
          <Switch>
          <Route path="/" exact component={ App } />
          <Route path="/admin" exact component={ AdminDashboard } />
          <Route path="/admin/admins" exact component={AddAdmins} />
          <Route path="/admin/faculties" exact component={AddFaculties} />
          <Route path="/admin/students" exact component={AddStudent} />
          <Route path="/admin/display/admins" exact component={DIsplayAdmins} />
          <Route path="/admin/display/students" exact component={DisplayStudents} />
          <Route path="/admin/display/faculties" exact component={DisplayFaculties} />
          <Route path="/faculty" exact component={FacultyDashboard} />
          <Route path="/faculty/viewExam" exact component={ViewExams} />
          <Route path="/faculty/createExam" exact component={CreateExam} />
          <Route path="/student" exact component={StudentDashboard} />
          <Route path="/student/viewExam" exact component={ViewExamss} />
          <Route path="/scanner/:data" render={props => <Pdf {...props} />} />
          <Route path="/faculty/viewResponse/:id" exact component={ViewResponse} />
          <Route path="/faculty/showanswersheet/:data/:examId" render={props => <ShowAnswersheet {...props} />} />
          <Route path="/faculty/uploadresult" exact component={UploadResult} />
          <Route path="/student/viewresult" exact component={ViewResult} />
          <Route path="/forgotpassword" exact component={Forgotpassword} />
          <Route path="/student/studentprofile" exact component={StudentProfile} />
          <Route path="/admin/adminprofile" exact component={AdminProfile}/>
          <Route path="/faculty/facultyProfile" exact component={FacultyProfile} />
          <Route path="/*" exact component={ NotFound } />
          </Switch>
        </div>
      </BrowserRouter>
  </React.StrictMode>,
  
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
