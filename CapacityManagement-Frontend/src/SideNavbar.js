import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Collapse, Accordion, Card, Form, Col  } from 'react-bootstrap';
import  AzureLocations from './AzureLocations';


export default class SideNavbar extends Component {

static propTypes = {
    selectedGeography: PropTypes.string.isRequired,
    listRegions: PropTypes.arrayOf(PropTypes.string)
}

constructor(props) {
    super(props);
}

componentDidMount()
{

}

getRegionsForGeography() 
{
    const {selectedGeography} = this.props;
    if(selectedGeography != "")
    {
        var listRegions = [];
        Object.keys(AzureLocations).forEach(function(key) {
            if(AzureLocations[key].geography == selectedGeography)
            {
                listRegions.push(key);
            }
        });
        this.listRegions = listRegions;
    }
}

selectGeography = (selectedGeography) =>
{
    console.log(selectedGeography);
    console.log(selectedGeography.target.value);
    console.log(this.props.selectGeography);
    this.props.selectGeography(selectedGeography.target.value);
}
render() {

    this.getRegionsForGeography();

    return (
        <>
            <Accordion defaultActiveKey="0">
            <Card>
                <Card.Header>
                <Accordion.Toggle as={Button} variant="link"  eventKey="0">
                    Select Regions {this.props.accordionOpen}
                </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                <Card.Body>
                <Form>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridGeography">
                        <Form.Label>Geography</Form.Label>
                        <Form.Control as="select" onChange={this.selectGeography}>
                            <option>Choose...</option>
                            <option>Americas</option>
                            <option>Asia Pacific</option>
                            <option>Europe</option>
                            <option>Middle East and Africa</option>
                            <option>Azure Government</option>
                        </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridRegions">
                        <Form.Label>Regions</Form.Label>
                        <Form.Control as="select">
                            <option>Choose...</option>
                            {this.listRegions != null &&
                             this.listRegions.map((e) => {
                                return <option key={e}>{e}</option>;
                             })
                            }
                        </Form.Control>
                        </Form.Group>
                    </Form.Row>
                </Form>
                </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card/>
            </Accordion>
        </>
    );
    
}
  
}