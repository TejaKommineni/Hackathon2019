import React, { Component } from 'react';
import Map from "./Map";
import TopNavbar from "./TopNavbar";
import {Container , Row, Col } from 'react-bootstrap';

class Geographical extends Component {
  
  render() {    
    let geographyType  = this.props.match.params.id;
    console.log(geographyType);
    let geographyValue = "";
    if(geographyType === 1)
    {
      geographyValue  = "Americas";
    } 
    if(geographyType === 2)
    {
      geographyValue  = "Asia Pacific";
    } 
    if(geographyType === 3)
    {
      geographyValue  = "Europe";
    } 
    if(geographyType === 4)
    {
      geographyValue  = "Middle East And Africa";
    } 
    if(geographyType === 5)
    {
      geographyValue  = "Azure Government";
    } 
    return (      
      <Container fluid={true}  style={{ paddingLeft: 0, paddingRight: 0, height: "100%" }} >
      <Row>
        <Col><TopNavbar/></Col>
      </Row>
      <Row style={{ paddingLeft: 0, paddingRight: 0, height: "100%" }} >
        <Col><Map  isGeographical = {true} geographyType = {geographyValue}/></Col>
      </Row>
      </Container>
    );
  }  
}

export default Geographical;