import * as React from 'react';
import { Route, Link, NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import PageCharacters from '../PageCharacters';
import PageCharacterInfo from '../PageCharacterInfo';
import './Root.less';

const Root = () => (
  <div className="Root">
    <Navbar bg="dark" variant="dark">
      <Container>
        <Row>
          <Col xs={12} md={12}>
            <NavLink className="Link nav-link Root__navbar" to="/">
              StarWars Characters
            </NavLink>
          </Col>
        </Row>
      </Container>
    </Navbar>

    <Container>
      <Row>
        <Col xs={12} md={12}>
          <Route exact path="/" component={PageCharacters} />
          <Route path="/character" component={PageCharacterInfo} />
        </Col>
      </Row>
    </Container>
  </div>
);

export default Root;
