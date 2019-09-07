import * as React from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';

import './PageCharacters.less';

import data from '../../testData/charactersList.json';



const getId = (swapiUrlString) => {
  const result = swapiUrlString.match('/(?:\\D*\/)(\\d*)/');

  return result[1];
};



const PageCharactersTable = ({ items = [], onClickId }) => {
  return (
    <Table striped bordered hover>
      <thead>
      <tr>
        <th>Name</th>
        <th>Birth Year</th>
        <th>Gender</th>
        <th>Height</th>
        <th>Mass</th>
        <th>more</th>
      </tr>
      </thead>
      {items.length && (
        <tbody>
          {items.map((item) => (
            <tr key={item.url}>
              <td>{item.name}</td>
              <td>{item.birth_year}</td>
              <td>{item.gender}</td>
              <td>{item.height}</td>
              <td>{item.mass}</td>
              <td>
                <Button variant="link" onClick={onClickId(getId(item.url))} size="sm">More information</Button>
              </td>
            </tr>
          ))}
        </tbody>
      )}
    </Table>
  )
};



const PageCharacters = () => {

  const handleClickId = (id) => () => {
    console.log('handleClickId', id);
  };

  return (
    <div>
      <div className="PageCharacters__head">
        List of Characters
      </div>
      <div className="PageCharacters__table">
        <PageCharactersTable items={data.results} onClickId={handleClickId}/>
      </div>
      <div className="PageCharacters__pagination">
        <Pagination>
          <Pagination.First/>
          <Pagination.Prev/>
          <Pagination.Item>{1}</Pagination.Item>
          <Pagination.Next/>
          <Pagination.Last/>
        </Pagination>
      </div>
    </div>
  )
};


export default PageCharacters;
