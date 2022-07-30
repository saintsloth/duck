import React, { useState } from 'react';
import RegistrationForm from './registration-form';
import { Navigate } from 'react-router-dom';

function Registration() {
  const [response, setResponse] = useState({ ok: false });

  // useEffect(() => console.dir(response), [response, response.statusCode])



  if (response.ok) {
    return (
      <Navigate to={'/signin'} />
        );
  } else {
    return (
      <div className="container">
        <RegistrationForm setResponse={setResponse} />
      </div>
    )
  }
}

export default Registration;