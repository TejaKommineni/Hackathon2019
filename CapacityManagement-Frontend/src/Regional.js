import React from "react";
import RegionalMap from "./RegionalMap";
import TopNavbar from "./TopNavbar";
import SideNavbar from "./SideNavbar";
import {Container , Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux'
import './Global.css';
import { selectGeography, selectRegion } from './redux/Actions'

class Regional extends React.Component {

    
	render() {
    console.log("regional");
        console.log(this.props.selectedRegion);
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
                  selectRegion={this.props.selectRegion}
                  /></Col>
        <Col><RegionalMap region={this.props.selectedRegion}/></Col>
			</Row>
		  </Container>
		);
	}
}

const mapStateToProps = state => ({
    selectedGeography: state.regional.selectedGeography,
    selectedRegion: state.regional.selectedRegion
  })
  
  const mapDispatchToProps = dispatch => ({
    selectGeography: selectedGeography => dispatch(selectGeography(selectedGeography)),
    selectRegion: selectedRegion => dispatch(selectRegion(selectedRegion))
  })
  
const RegionalContainer =  connect(
    mapStateToProps,
    mapDispatchToProps
)(Regional)

export default RegionalContainer;