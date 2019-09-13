import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';
import React from 'react';
import './PageCharactersTable.less';

function getIdFromUrl(swapiUrlString) {
  const result = swapiUrlString.match('/(?:\\D*/)(\\d+)/');

  return result[1];
}

const PageCharactersTable = ({ items }) => {
  return (
    <Table className="PageCharactersTable" striped bordered hover>
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
      {items.length ? (
        <tbody>
          {items.map(({ url, name, birth_year, gender, mass, height }) => (
            <tr key={url}>
              <td>{name}</td>
              <td>{birth_year}</td>
              <td>{gender}</td>
              <td>{height}</td>
              <td>{mass}</td>
              <td>
                <Link
                  to={{
                    pathname: `/character/${getIdFromUrl(url)}`,
                  }}
                >
                  More information
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      ) : null}
    </Table>
  );
};

export default PageCharactersTable;
