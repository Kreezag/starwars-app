import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Jumbotron from 'react-bootstrap/Jumbotron';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import PageHeader from '../../ui/PageHeader';
import './PageCharacterInfo.less';
import AlertError from '../../ui/AlertError';
import LoadingWrapper from '../../ui/LoadingWrapper';

const createFetchRequest = url => {
  return fetch(new Request(url, { method: 'GET' })).then(response =>
    response.json(),
  );
};

const mkFetchRequestOfArrayUrls = arr => {
  if (Array.isArray(arr) && arr.length) {
    const promisesArr = arr.reduce(
      (prev, el) => [...prev, createFetchRequest(el)],
      [],
    );

    return Promise.all(promisesArr);
  }

  return null;
};

const createExtendedPersonalDateRequest = peopleID => {
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
};

const PageCharacterInfo = ({ location }) => {
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
      .catch(err => {
        if (isSubscribed) {
          return setError(err);
        }

        return null;
      });

    return () => (isSubscribed = false);
  }, [peopleId]);

  return (
    <div className="PageCharacterInfo">
      <PageHeader>
        <Link to={{ pathname: `/` }}>List of Characters</Link>&nbsp;/&nbsp;
        {extendedPersonalData ? extendedPersonalData.name : '...'}
      </PageHeader>
      <AlertError>{error}</AlertError>
      <LoadingWrapper isLoading={!extendedPersonalData && !error}>
        <Jumbotron className="PageCharacterInfo__body">
          {extendedPersonalData ? (
            <Container>
              <Row>
                <Col xs={6} md={6}>
                  <ListGroup
                    variant="flush"
                    className="PageCharacterInfo__bodyList"
                  >
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
                  <ListGroup
                    variant="flush"
                    className="PageCharacterInfo__bodyList"
                  >
                    <ListGroup.Item>
                      <div className="PageCharacterInfo__bodyFilmsHead">
                        Films:{' '}
                      </div>
                    </ListGroup.Item>
                    {Array.isArray(extendedPersonalData.films) &&
                    extendedPersonalData.films.length > 0
                      ? extendedPersonalData.films.map(
                          (
                            {
                              url,
                              title,
                              release_date,
                              openning_crawl,
                              episode_id,
                              opening_crawl,
                            },
                            index,
                          ) => (
                            <ListGroup.Item key={url}>
                              <div>
                                <b>Name:</b> Episode {episode_id} {title}
                              </div>
                              <div>
                                <b>Relise dete:</b> {release_date}
                              </div>
                              <div>
                                <b>Opening:</b> {opening_crawl}
                              </div>
                              {index ===
                              extendedPersonalData.films.length - 1 ? null : (
                                <br />
                              )}
                            </ListGroup.Item>
                          ),
                        )
                      : null}
                  </ListGroup>
                </Col>
              </Row>
            </Container>
          ) : null}
        </Jumbotron>
      </LoadingWrapper>
    </div>
  );
};

export default PageCharacterInfo;
