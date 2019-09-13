import React, { useState, useEffect } from 'react';
import PageCharactersPagination from './PageCharactersPagination';
import PageCharactersTable from './PageCharactersTable';
import PageHeader from '../../ui/PageHeader';
import AlertError from '../../ui/AlertError';
import './PageCharacters.less';

const DEFAULT_COUNT_REQUEST_ITEMS = 10;

const paginationPageCounts = (totalCounts = 0) => {
  if (!totalCounts) {
    return 0;
  }

  return Math.ceil(totalCounts / DEFAULT_COUNT_REQUEST_ITEMS);
};

const PageCharacters = () => {
  const [request, setRequestData] = useState({ totalCount: 0, items: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isSubscribed = true;
    createRequest(currentPage)
      .then(data => {
        if (isSubscribed) {
          return setRequestData(data);
        }

        return null;
      })
      .catch(err => {
        if (isSubscribed) {
          return setError(err);
        }
      });

    return () => (isSubscribed = false);
  }, [currentPage]);

  const pageCounts = paginationPageCounts(request.totalCount);
  const setPaginationPage = page => () => setCurrentPage(page);

  return (
    <div className="PageCharacters">
      <PageHeader>List of Characters</PageHeader>
      <AlertError>{error}</AlertError>

      {request.items.length ? (
        <React.Fragment>
          <div className="PageCharacters__table">
            <PageCharactersTable items={request.items} />
          </div>

          <div className="PageCharacters__pagination">
            {pageCounts ? (
              <PageCharactersPagination
                currentPageNum={currentPage}
                pagesCount={pageCounts}
                onPageClick={setPaginationPage}
              />
            ) : null}
          </div>
        </React.Fragment>
      ) : (
        'Loading...'
      )}
    </div>
  );
};

async function createRequest(page) {
  let requestUrl = new URL('https://swapi.co/api/people/');

  if (page) {
    requestUrl.searchParams.set('page', page);
  }

  const request = new Request(requestUrl, { method: 'GET' });

  return fetch(request)
    .then(response => response.json())
    .then(result => ({
      totalCount: result.count,
      items: result.results,
    }));
}
export default PageCharacters;
