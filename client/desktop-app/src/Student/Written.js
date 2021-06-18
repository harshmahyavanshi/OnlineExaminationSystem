import React, { Component, useState } from "react";
import { Document, Page } from "react-pdf";

import AllPages from './SinglePage';
import {Jumbotron} from 'reactstrap'
import './pdf-style.css';
import axios from "axios";
import Timer from 'react-compound-timer'
import { displayName } from "qrcode.react";
var QRCode = require('qrcode.react');

export default class Pdf extends Component{
  
  constructor(props)
  {
    super(props);
    const { data } = props.match.params;
   // alert("examid in written.js "+data); 
    this.state = {
      pdf : "",
      id : data ,
      flag : false,
      timer : true,
      pdfduration : 0
    }
    
  }

  componentDidMount(){
    let pdfdata;
    let duration
    let id = this.state.id;
   // alert("in written id is "+ id)
    //alert(id);
    //let r=0;
    axios.post('http://localhost:5000/app/pdf',{ id })
    .then((Data) =>  {    
      pdfdata = Data.data.pdf.pdf ; 
      duration = Data.data.pdf.examDuration

     // alert("duration " + duration)
    // encP = pdfdata.split(';base64,').pop()
      //alert("in written post "+ pdfdata )
      this.setState({ 
        pdf : pdfdata,
        flag : true,
        pdfduration: duration*60*1000
       })
      
    })
    
    
    
  }
  //alert(props.match.params)
  
  render(){
    let display = [];
    if(this.state.flag && this.state.timer)
    {
      //alert(this.state.pdf)
      display.push(
        <div>
        <div className="App">
                                  {/*<h4>Single Page</h4>
                                  <SinglePagePDFViewer pdf={samplePDF} />

                                  <hr />
                                */}
      <center><h4>Take Your Exam</h4></center>
      <div className="all-page-container">
        
        <AllPages pdf={this.state.pdf} id={this.state.id} />
      </div>
      <hr />
      <div>
        <center>
        <Timer
            initialTime={this.state.pdfduration}
            direction="backward"
            checkpoints={[
              {
                  time: 0,
                  callback: () => 
                  {
                    
                    this.setState({
                      timer : false,
                    })
                  },
              },
              {
                  time: 5000 * 60,
                  callback: () => console.log('Checkpoint B'),
              }
          ]}
        >
            {() => (
                <React.Fragment>
                    <Timer.Hours /> hours
                    <spam> | </spam>
                    <Timer.Minutes /> minutes
                    <spam> | </spam>
                    <Timer.Seconds /> seconds
                </React.Fragment>
                
            )}
        </Timer>
        </center>
      </div>
    </div>
    
    </div>
    
  

      );
    }
    else if(this.state.timer === false)
    {
      let temp = document.cookie.split(";");  
      let email = temp[0].split("=")[1];
     // alert("email is "+email);
      display.push(
        <div>
          <center>
          <Jumbotron>
          <h1>Written exam is over</h1>
          <h3>You Need To Submit Your PDF Now</h3>
          <h4>You Have To Scan This QR-CODE To Submit Your Response.</h4>
          <h5>Use Your Phone Camera To Scan This QR-CODE.</h5>
          </Jumbotron>
          <div>
          
          <QRCode
          value={`http://192.168.43.39:3001/scanner/${email}/${this.state.id}`}
          size={128}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"L"}
          includeMargin={true}
          renderAs={"svg"}
          />
          </div>
          </center>
        </div>
      )
    }
    else{
      display.push(
        <div>
          <h1>Loading PDF...</h1>
        </div>
      )
    }
  return (
    <>
      {display}  
    </>
  );
}
}