import React, { useState, useEffect } from 'react';
import { getPeopleRequest } from '../../../services/api';
import PageCharactersPagination from './PageCharactersPagination';
import PageCharactersTable from './PageCharactersTable';
import PageHeader from '../../ui/PageHeader';
import AlertError from '../../ui/AlertError';
import LoadingWrapper from '../../ui/LoadingWrapper';
import './PageCharacters.less';

const DEFAULT_COUNT_REQUEST_ITEMS = 10;

const paginationPageCounts = (totalCounts = 0) => {
  if (!totalCounts) {
    return 0;
  }

  return Math.ceil(totalCounts / DEFAULT_COUNT_REQUEST_ITEMS);
};

const createPeoplePageRequest = page =>
  getPeopleRequest({ page }).then(({ result }) => ({
    totalCount: result.count,
    items: result.results,
  }));

const PageCharacters = () => {
  const [request, setRequestData] = useState({ totalCount: 0, items: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isSubscribed = true;

    createPeoplePageRequest(currentPage)
      .then(data => {
        console.log('data', data);
        if (isSubscribed) {
          setError(null);

          return setRequestData(data);
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
  }, [currentPage]);

  const pageCounts = paginationPageCounts(request.totalCount);
  const setPaginationPage = page => () => setCurrentPage(page);

  return (
    <div className="PageCharacters">
      <PageHeader>List of Characters</PageHeader>
      <AlertError>{error}</AlertError>
      <LoadingWrapper isLoading={request.items.length === 0}>
        <React.Fragment>
          <PageCharactersTable items={request.items} />

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
      </LoadingWrapper>
    </div>
  );
};

export default PageCharacters;
