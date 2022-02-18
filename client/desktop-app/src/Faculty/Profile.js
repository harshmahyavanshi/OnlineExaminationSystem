import React, { Component, Fragment,  } from 'react';

import { Card, CardText, CardTitle, Breadcrumb, BreadcrumbItem,Button } from 'reactstrap';
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from 'react-router-dom';
import StudentHeader from './Header';
import ShowModalCase from './ResetPassword';


const axios = require('axios');
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: "Yo",
            loader: false,
            addModalShow: false,
            modalHeader: "Reset Password",
        }
    }
    componentDidMount() {
        this.setState({
            loader: true
        });
        let self = this;
        let temp = document.cookie.split(";");
        let email = temp[0].split("=")[1];
        let role = temp[1].split("=")[1];
        let orgId = temp[2].split("=")[1];
        
      // alert("orgId "+this.state.student)
        axios.post("http://localhost:5000/getProfile/faculty",{email})
            .then((studentData) => {
                this.setState({
                    student: studentData.data.users[0],
                    loader: false
                });
               // alert(this.state.student.firstname)
                //alert(studentData.data.users[0].firstname)
                
            })
            .catch((err) => {
                self.setState({
                    loader: false
                });
            })
    }

    resetButton =()=>{
        this.setState({
            addModalShow: true
        });}
        
    render() {
        let addModalClose = () => {
            this.setState({
                addModalShow: false
            });
        }
        let profile = [];
        if (this.state.student === "" && this.state.loader===false) {
            profile.push(
                <p>
                    Failed to fetch data.
                </p>
            );
        
        } 
        else {
          
               profile.push(      
                   <>           
                    <Card body inverse color="warning" style={{ margin: 10 }}>
                         <CardTitle>Profile</CardTitle>
                    </Card>

                        <Card body inverse  style={{ margin: 10 , backgroundColor:"pink" }}>
                        <CardText>Full Name: {this.state.student.firstname} {this.state.student.lastname}</CardText>

                         <CardText>Email: {this.state.student.email} </CardText>
                         <CardText>Role: {this.state.student.role} </CardText>
                         <CardText>University: {this.state.student.university}</CardText>
                         <CardText>Reset Password : <Button color="info" onClick={this.resetButton}>Reset</Button> </CardText>
                         <ShowModalCase
                                show={this.state.addModalShow}
                                onHide={addModalClose}
                                email={this.state.student.email}
                                header={this.state.modalHeader}
                            />
                  </Card>   
                  </>              
                ); 
            
        }
        return (
            <Fragment>
                <div className="wrapper">
                <StudentHeader />
                    <div id="content">
                        <div className="row">
                            <Breadcrumb>
                                <BreadcrumbItem><Link to="/student"><i className="fa fa-home fa-sm"></i> Dashboard</Link></BreadcrumbItem>
                                <BreadcrumbItem active>Profile</BreadcrumbItem>
                            </Breadcrumb>
                        </div>
                        <ClipLoader
                            size={50}
                            color={"#123abc"}
                            loading={this.state.loader}
                        />
                        {profile}
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Profile;
