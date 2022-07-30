import React, { useState } from 'react';
import SigninForm from './signin-form';
import { Navigate } from 'react-router-dom';

function Signin() {
  const [response, setResponse] = useState({ ok: false });

  // useEffect(() => console.dir(response), [response, response.statusCode])

  if (response.ok) {
    return (
      <Navigate to={'/'} />
    );
  } else {
    return (
      <div className="container">
        <SigninForm setResponse={setResponse} />
      </div>
    )
  }
}

export default Signin;