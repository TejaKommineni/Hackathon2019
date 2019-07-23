import React from "react";
import Map from "./Map";
import TopNavbar from "./TopNavbar";
import SideNavbar from "./SideNavbar";
import {Container , Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux'
import './Global.css';
import { selectGeography } from './redux/Actions'

class Regional extends React.Component {

    
	render() {
        console.log(this.props.selectedGeography);
		return (				
			<Container fluid={true}  style={{ paddingLeft: 0, paddingRight: 0, height: "100%" }} >
            <Row> {this.props.accordionOpen}</Row>
			<Row>
			  <Col><TopNavbar/></Col>
			</Row>
            <Row style={{ paddingLeft: 0, paddingRight: 0, height: "100%" }}>
			  <Col xs={2}>
                  <SideNavbar 
                  selectedGeography={this.props.selectedGeography}
                  selectGeography={this.props.selectGeography}
                  /></Col>
        <Col><Map/></Col>
			</Row>
		  </Container>
		);
	}
}

const mapStateToProps = state => ({
    selectedGeography: state.regional.selectedGeography
  })
  
  const mapDispatchToProps = dispatch => ({
    selectGeography: selectedGeography => dispatch(selectGeography(selectedGeography))
  })
  
const RegionalContainer =  connect(
    mapStateToProps,
    mapDispatchToProps
)(Regional)

export default RegionalContainer;