import React from "react";
import Map from "./Map";
import TopNavbar from "./TopNavbar";
import {Container , Row, Col } from 'react-bootstrap';
import './Global.css';

export default class Global extends React.Component {

	render() {
		return (				
			<Container fluid = {true}  style={{paddingLeft: 0, paddingRight: 0, height: "100%"}} >
			<Row style={{height: "10%", margin: 0}}>
			  <Col style={{paddingLeft: 0, paddingRight: 0 }}><TopNavbar/></Col>
			</Row>
			<Row style={{paddingLeft: 0, paddingRight: 0, height: "90%", margin: 0}} >
			  <Col style={{paddingLeft: 0, paddingRight: 0}}><Map/></Col>
			</Row>
		  </Container>
		);
	}
}