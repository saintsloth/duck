import React from 'react';
import { useLocation } from 'react-router-dom';
// import { locale } from '../locales/index.tsx';

function PageNotFound() {
  const location = useLocation();

  return (
    <>
      <div>
        <h3>
          {/*{locale.t('noPage')}*/}
          {' '}
          <code>{location.pathname}</code>
        </h3>
      </div>
    </>
  );
}

export default PageNotFound;
