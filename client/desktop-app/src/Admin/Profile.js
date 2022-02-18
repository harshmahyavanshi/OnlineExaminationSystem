import React, { Component, Fragment } from 'react';

import { Card, CardText, CardTitle, Breadcrumb, BreadcrumbItem,Button } from 'reactstrap';
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from 'react-router-dom';
import AdminHeader from './Header';
import ReactRoundedImage from "react-rounded-image";
import ShowModalCase from './Modal';


const axios = require('axios');
class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            admin: "Yo",
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
        axios.post("http://localhost:5000/getProfile/admin",{email})
            .then((adminData) => {
                this.setState({
                    admin: adminData.data.users[0],
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
        });
    }
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

                        <Card body inverse color="info" style={{ margin: 10 , alignItems:"center"}}>
                        <CardText><ReactRoundedImage image={this.state.admin.photo} hoverColor="#D1D0CE"/></CardText>
                        <Card  style={{backgroundColor:"pink" }}>
                            <CardText> Full Name: {this.state.admin.firstname} {this.state.admin.lastname}</CardText>

                            <CardText>Email: {this.state.admin.email} </CardText>
                            <CardText>Role: Admin </CardText>
                            <CardText>University: {this.state.admin.university}</CardText>
                            <CardText>Reset Password : <Button color="info" onClick={this.resetButton}>Reset</Button> </CardText></Card>
                            <ShowModalCase
                                show={this.state.addModalShow}
                                onHide={addModalClose}
                                email={this.state.admin.email}
                                header={this.state.modalHeader}
                            />
                        
                  </Card>   
                  </>              
                ); 
            
        }
        return (

            <Fragment>
                <div className="wrapper">
                <AdminHeader />
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
