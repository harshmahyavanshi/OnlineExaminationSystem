import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import axios from 'axios';
import { Button } from "reactstrap";
import './pdf-style.css';
var QRCode = require('qrcode.react');
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;



export default function AllPages(props) {
  
  const [numPages, setNumPages] = useState(null);
  const [Count, setCount] = useState(0);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  
  /*let id = props.id
  let pdfdata
  
  axios.post('http://localhost:5000/app/pdf',{id })
  .then((Data) =>  {    
    pdfdata = Data.data.pdf ; 
   // encP = pdfdata.split(';base64,').pop()
    alert("in singlepage "+ pdfdata )
   
  })
  
*/
 // alert("in singlepage-------- "+ props.pdf )
  
  const { pdf } = props.pdf;
  
  //alert("In Single"+ pdf);
  const ShowQR = () => { 
    //alert("In QR");
    setCount(1);
  }

  const RenderData = () => {
    //alert("In Fun");
    if(Count==0)
    { 
      //alert("In If");
      return(
      <div>
      
      <Button onClick={ShowQR}>Submit</Button>
      
      </div>
      );
    }
    else{
      let temp = document.cookie.split(";");  
      let email1 = temp[0].split("=")[1];
      let role = temp[1].split("=")[1];
      let orgId = temp[2].split("=")[1];
     // alert("in single page "+ email1);
      return( 
      <div>
      <QRCode
      value={`http://192.168.43.39:3001/scanner/${email1}/${props.id}`}
      size={128}
      bgColor={"#ffffff"}
      fgColor={"#000000"}
      level={"L"}
      includeMargin={true}
      renderAs={"svg"}
      />
      </div>
      );
      }

  }
  return (
    <>
    <Document
      file={props.pdf}
      options={{ workerSrc: "/pdf.worker.js" }}
      onLoadSuccess={onDocumentLoadSuccess}
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={1.5} />
      ))}
    </Document>
    <br />
    <center>
    {
    RenderData()
    }    
      </center>
  </>
  );
}