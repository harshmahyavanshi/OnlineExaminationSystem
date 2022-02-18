import Axios from 'axios';
import React from 'react';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { Modal, Button } from 'react-bootstrap';
import FadeLoader from 'react-spinners/FadeLoader';
const axios = require('axios');
const path = require('path');
const electron = window.require('electron');
const Notification = electron.remote.Notification; 

export default class ShowModalCase extends React.Component {
    constructor() {
        super();
        this.state = {
            textarea: '',
            spinner : false,
            email: "",
            password: "",
            errorMessage: "",
         
            cfmpassword: ""
        }
    }

    handleInputChange = (e) => {

        this.setState({
            [e.target.name]: e.target.value.trim(),
        });
    }

    sendValues = (event) => {
        event.preventDefault();
       // alert("hi")
        if(this.state.password !== "" && this.state.cfmpassword !=="" && this.state.cfmpassword===this.state.password)
        {
           
         let changepass = []
         changepass.push({
             email: this.props.email,
             password: this.state.password
         })
         axios.post('http://localhost:5000/forgotpassword/changepassword',{details: changepass})
         .then((response)=>{
            // alert(response.data.message)
            const options = { 
             title: 'Message', 
             subtitle: 'Total', 
             body: `${response.data.message}`, 
             silent: false, 
             icon: path.join(__dirname, '../assets/image.png'), 
             hasReply: true,   
             timeoutType: 'never',  
             replyPlaceholder: 'Reply Here', 
             sound: path.join(__dirname, '../assets/sound.mp3'), 
             urgency: 'critical' ,
             closeButtonText: 'Close Button',
             actions: [ { 
                 type: 'button',  
                 text: 'Show Button'
             }] 
         } 
         const customNotification = new Notification(options)
         customNotification.show()
            this.props.onHide()
         })
        }
        else
        {
         const options = { 
             title: 'Message', 
             subtitle: 'Total', 
             body: `Passwords should be match but not empty`, 
             silent: false, 
             icon: path.join(__dirname, '../assets/image.png'), 
             hasReply: true,   
             timeoutType: 'never',  
             replyPlaceholder: 'Reply Here', 
             sound: path.join(__dirname, '../assets/sound.mp3'), 
             urgency: 'critical' ,
             closeButtonText: 'Close Button',
             actions: [ { 
                 type: 'button',  
                 text: 'Show Button'
             }] 
         } 
         const customNotification = new Notification(options)
         customNotification.show()
        }
        
    }

     handlechange = (event)=>{
        if(event.target.name==="email")
        {
            this.setState({email : event.target.value})
        }
        if(event.target.name==="password")
        {
            this.setState({password :event.target.value})
            if(event.target.value.length < 6){
                this.setState({errorMessage:"password length must be greater than 6"})
            }
            else{
                
                if(event.target.value  === this.state.cfmpassword ){
                    this.setState({errorMessage :""})
                   // setCfmpassword("confirm")
                }
                else{
                    this.setState({errorMessage:"Password don't match"})
                }
            }
        }
        if(event.target.name==="cfmpassword")
        {
            this.setState({cfmpassword : event.target.value})
            if(event.target.value  === this.state.password ){
                this.setState({errorMessage :""})
               // setCfmpassword("confirm")
            }
            else{
                this.setState({errorMessage:"Password don't match"})
            }
    
        }
       // alert(email)
    }

    render() {
        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header>
                    <Modal.Title>
                        {this.props.header}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <center><FadeLoader loading = {this.state.spinner} size={60} /></center>
                <>
                    <Form className="login-form" >
                            <FormGroup>
                                <Label>Password</Label>
                                <Input type="password" placeholder="Password" name="password" id="password" onChange={this.handlechange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label>Confirm Password</Label>
                                <Input type="text" placeholder="Confirm Password" name="cfmpassword" id="cfmpassword" onChange={this.handlechange}/>
                                {this.state.errorMessage && <div className="error"> {this.state.errorMessage} </div>}
                            </FormGroup>
                            <FormGroup>
                                <Button className="btn-lg btn-dark btn-block" onClick={this.sendValues}>Confirm</Button>
                            </FormGroup>
                        </Form>
                        
                    </>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide} >Close</Button>
                    <Button type="submit" color="primary"
                        onClick={this.sendValues}
                    >Submit</Button>
                    
                </Modal.Footer>
            </Modal>
        )
    }
}