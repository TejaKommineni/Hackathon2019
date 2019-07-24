import React, { Component } from 'react';
import { NavDropdown, Navbar, Nav, Form, FormControl, Button  } from 'react-bootstrap';

class TopNavbar extends Component {

  
  render() {
    
    return (
            <Navbar bg="primary" variant="dark">
                <Navbar.Brand href="/global">Capacity Management</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/global">Global</Nav.Link>
                    <NavDropdown title="Geographical">
                        <NavDropdown.Item href="/geographical/1">Americas</NavDropdown.Item>
                        <NavDropdown.Item href="/geographical/2">Asia Pacific</NavDropdown.Item>
                        <NavDropdown.Item href="/geographical/3">Europe</NavDropdown.Item>
                        <NavDropdown.Item href="/geographical/4">Middle East and Africa</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/geographical/5">Azure Government</NavDropdown.Item>
                    </NavDropdown>
                    <Nav.Link href="/regional">Region</Nav.Link>
                </Nav>
                <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-light">Search</Button>
                </Form>
            </Navbar>
    );
    
  }
  
}

export default TopNavbar;