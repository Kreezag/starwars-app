import * as React from 'react';
import { Route, NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import './App.less';



const App = () => (
  <div className="App">
    <Navbar bg="dark" variant="dark">
      <Container>
        <Row>
          <Col xs={12} md={12}>
            <NavLink className="Link nav-link App__navbar" to="/">StarWars Characters</NavLink>
          </Col>
        </Row>
      </Container>
    </Navbar>

    <Container>
      <Row>
        <Col xs={12} md={12}>
          <Route exact path="/" component="Hello" />
        </Col>
      </Row>
    </Container>
  </div>
);

export default App;
