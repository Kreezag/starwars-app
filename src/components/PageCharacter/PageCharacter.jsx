import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ListGroup from 'react-bootstrap/ListGroup';
import './PageCharacter.less';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';

const PageCharacter = ({ location }) => {
  const peopleId = String(location.pathname)
    .split('/')
    .pop();

  const [extendedPersonalData, setExtendedPersonalData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    createExtendedPersonalDateRequest(peopleId)
      .then(data => {
      if (isSubscribed) {
        setError(null);

        return setExtendedPersonalData(data);
      }

      return null;
    })
    .catch((err => {
      if (isSubscribed) {
        return setError(err);
      }
    });

    return () => (isSubscribed = false);
  }, [peopleId]);

  return (
    <div>
      <div className="PageCharacter__head">
        <div>
          <Link to={{ pathname: `/` }}>List of Characters</Link>&nbsp;/&nbsp;
          {extendedPersonalData ? extendedPersonalData.name : '...'}
        </div>
      </div>
      {error ? (
        <Alert variant='danger' className="PageCharacter__error">
          {JSON.stringify(error)}
        </Alert>
      ) : null}
      {extendedPersonalData && !error ? (
        <Jumbotron className="PageCharacter__body">
          <Container>
            <Row>
              <Col xs={6} md={6}>
                <ListGroup variant="flush" className="PageCharacter__bodyList">
                  <ListGroup.Item>
                    <b>Name:</b>&nbsp;{extendedPersonalData.name}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <b>Gender:</b>&nbsp;{extendedPersonalData.gender}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <b>Height:</b>&nbsp;{extendedPersonalData.height}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <b>Mass:</b>&nbsp;{extendedPersonalData.mass}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <b>Hair color:</b>&nbsp;{extendedPersonalData.hair_color}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <b>Skin color:</b>&nbsp;{extendedPersonalData.skin_color}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <b>Eye color:</b>&nbsp;{extendedPersonalData.eye_color}
                  </ListGroup.Item>
                  {Array.isArray(extendedPersonalData.species) &&
                  extendedPersonalData.species.length > 0 ? (
                    <ListGroup.Item>
                      <b>Species:</b>&nbsp;
                      {extendedPersonalData.species
                        .map(el => el.name)
                        .join(',')}
                    </ListGroup.Item>
                  ) : null}
                  {extendedPersonalData.homeworld && (
                    <ListGroup.Item>
                      <b>Homeworld:</b>&nbsp;
                      {extendedPersonalData.homeworld.name}
                    </ListGroup.Item>
                  )}
                  {Array.isArray(extendedPersonalData.starships) &&
                  extendedPersonalData.starships.length > 0 ? (
                    <ListGroup.Item>
                      <b>Starships:</b>&nbsp;
                      {extendedPersonalData.starships
                        .map(el => el.name)
                        .join(',')}
                    </ListGroup.Item>
                  ) : null}
                </ListGroup>
              </Col>

              <Col xs={6} md={6}>
                <ListGroup variant="flush" className="PageCharacter__bodyList">
                  <ListGroup.Item>
                    <div className="PageCharacter__bodyFilmsHead">Films: </div>
                  </ListGroup.Item>
                  {Array.isArray(extendedPersonalData.films) &&
                  extendedPersonalData.films.length > 0
                    ? extendedPersonalData.films.map((el, index) => (
                        <ListGroup.Item>
                          <div>
                            <b>Name:</b> Episode {el.episode_id} {el.title}
                          </div>
                          <div>
                            <b>Relise dete:</b> {el.release_date}
                          </div>
                          <div>
                            <b>Opening:</b> {el.opening_crawl}
                          </div>
                          {index ===
                          extendedPersonalData.films.length - 1 ? null : (
                            <br />
                          )}
                        </ListGroup.Item>
                      ))
                    : null}
                </ListGroup>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      ) : (
        'Loading...'
      )}
    </div>
  );
};

export default PageCharacter;

async function createExtendedPersonalDateRequest(peopleID) {
  let requestUrl = new URL(peopleID, 'https://swapi.co/api/people/');

  return createFetchRequest(requestUrl).then(extendedPersonalData => {
    const {
      films,
      starships,
      species,
      vehicles,
      homeworld,
    } = extendedPersonalData;

    let extendedRequestFields = {};

    extendedRequestFields.homeworld = createFetchRequest(homeworld);
    extendedRequestFields.films = mkFetchRequestOfArrayUrls(films);
    extendedRequestFields.starships = mkFetchRequestOfArrayUrls(starships);
    extendedRequestFields.species = mkFetchRequestOfArrayUrls(species);
    extendedRequestFields.vehicles = mkFetchRequestOfArrayUrls(vehicles);

    const extendedRequestFieldsKeys = Object.keys(extendedRequestFields);

    return Promise.all(
      extendedRequestFieldsKeys.map(key => extendedRequestFields[key]),
    )
      .then(results =>
        results.reduce(
          (object, result, index) => ({
            ...object,
            [extendedRequestFieldsKeys[index]]: result,
          }),
          {},
        ),
      )
      .then(additionalPersonalData => ({
        ...extendedPersonalData,
        ...additionalPersonalData,
      }));
  });
}

async function mkFetchRequestOfArrayUrls(arr) {
  if (Array.isArray(arr) && arr.length) {
    const promisesArr = arr.reduce(
      (prev, el) => [...prev, createFetchRequest(el)],
      [],
    );

    return Promise.all(promisesArr);
  }

  return null;
}

async function createFetchRequest(url) {
  return fetch(new Request(url, { method: 'GET' })).then(response =>
    response.json(),
  );
}
