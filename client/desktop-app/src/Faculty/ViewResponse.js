import React, { Component, Fragment } from 'react';
import FacultyHeader from './Header';
import {Breadcrumb, BreadcrumbItem, Button,ListGroup, ListGroupItem , Badge} from 'reactstrap'
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from 'react-router-dom';
//import BackButton from "../BackButton"
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDownloadLink, Text, View, StyleSheet } from '@react-pdf/renderer'
import DownloadLink from "react-download-link";
import history from '../history'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';


const path = require('path');
const url =require('url');

const { remote , BrowserWindow , Menu } = window.require('electron');
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

 
const fs = require("fs");
const axios = require('axios');
const shell = window.require('electron').shell;
const electron = window.require('electron'); 

const Notification = electron.remote.Notification; 


class ViewResponse extends Component {
    constructor(props) {
        super(props);
        const { id } = props.match.params;
        //alert(id);
        this.state = {
            id : id,
            answersheet : "",
            flag : false,
            pending:0,
            showspinner : false,
            responses:true
        }

        this.handleUrlRedirect = this.handleUrlRedirect.bind(this);
    //   this.getDataFromURL = this.getDataFromURL.binf(this)
        this.viewpdf = this.viewpdf.bind(this)
        this.download =this.download.bind(this)
        this.back = this.back.bind(this)
        this.createNotification = this.createNotification.bind(this)
    }

    
  
    
    
    componentDidMount(){
        const id = this.state.id;
        //alert(id);

          
        this.setState({
            showspinner: true,
          })

        axios.post('http://localhost:5000/AnswerSheet',{ id })
        .then((Data) =>  { 
            if(Data.data.statusMessage){
              //  alert(Data.data.statusMessage)
            } 
           // alert( Data.data.answers[0].students[0].pdf)  
            this.setState({
                
                answersheet : Data.data.answers[0].students,             
                flag : true,
                showspinner: false,
                pending: Data.data.pending
            })                      
               if(this.state.answersheet[0] === undefined){
                   this.setState({
                        responses : false
                   })
               }
                
          //  alert("answersheet "+ this.state.answersheet[0])
        })
    }

    viewpdf(url){           

        const BrowserWindow = remote.BrowserWindow;
        const win = new BrowserWindow({
          height: 600,
          width: 800,
         
          webPreferences: {  enableRemoteModule: true ,webSecurity: false, nodeIntegration: true } 
        });

      // alert("url is " + url)
        win.loadURL(`http://localhost:3000/faculty/showanswersheet/${url}/${this.state.id}`);
    }
    

    download (pdf,name) {
       // alert("download")
    const linkSource = pdf;
    const downloadLink = document.createElement("a");
    const fileName = name;

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();

    }

    handleUrlRedirect = (url) => () => {
        shell.beep();
        
        shell.openExternal(url);
    }

    back(){
        history.push('/faculty/viewExam')
    }


    createNotification = (type) => {
        return () => {
          switch (type) {
            case 'info':
              NotificationManager.info(`${this.state.pending}`);
              break;
            case 'success':{
              NotificationManager.info( `${this.state.pending}`,'Pending Students');
             
              break;
            }
            case 'warning':
              NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
              break;
            case 'error':
              NotificationManager.error('Error message', 'Click me!', 5000, () => {
                alert('callback');
              });
                  break;
                  default:
    
          }
        };
      };
      
      

    render() {
       
          
        // Instantiating a new Notifications Object 
        // with custom Options 
       
        
        
        let renderData = [];
        if(this.state.flag)
        {
            if(this.state.responses ===true){

                for (let i = 0; i < this.state.answersheet.length; i++) {
           
                    renderData.push(
                                <ListGroupItem> <p>Name : {this.state.answersheet[i].studentName} </p>
                                                <p>email : {this.state.answersheet[i].studentEmail}</p>
                                               <p> <Button inverse color="success" onClick={() => this.viewpdf(this.state.answersheet[i].studentEmail,this.state.answersheet[i].examId)}>View Answersheet</Button></p>
                                               <p> <Button onClick={()=>this.download(this.state.answersheet[i].pdf,this.state.answersheet[i].pdfName)}><i class="fa fa-download" ></i>Download</Button></p>
                                               
                                </ListGroupItem>
                        
                    );
                }
            }
            else{

                renderData.push(<h3>No responses Found!</h3>);

            }
           
          
            
        }
        else {
            renderData.push(<h3>Data Loading...</h3>);
        }
        return (
            <>
                <div className="wrapper">
                    <FacultyHeader />
                    
                    <div id="content">
                        <div className="row">
                            <Breadcrumb>
                                <BreadcrumbItem><Link to="/faculty"><i className="fa fa-home fa-sm"></i> Dashboard</Link></BreadcrumbItem>
                                <BreadcrumbItem><Link to="/faculty/viewExam"><i className="fa fa-home fa-sm"></i>All Exams</Link></BreadcrumbItem>
                                <BreadcrumbItem active> View Responses</BreadcrumbItem>
                            </Breadcrumb>
                            <div className="col-12">
                                <h3>View Responses</h3>
                                <hr />
                            </div>
                        </div>
                        <button className='btn btn-danger' onClick={this.createNotification('success')}>See Pending responses</button><br/>
                        {/*customNotification.show()*/}
                        <NotificationContainer/><br/>
                        <ListGroup>
                            {renderData}
                        </ListGroup>
                        <ClipLoader
                            size={50}
                            color={"#123abc"}
                            loading={this.state.showspinner}
                        />
                  
                    </div>
                   
                </div>
            </>
          );

    }
}

export default ViewResponse;