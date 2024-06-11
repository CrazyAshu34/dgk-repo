import { Helmet } from 'react-helmet-async';
// sections
import Login from '../../sections/auth/Login';
// import Login from '../../sections/auth/LoginAuth0';

// ----------------------------------------------------------------------

export default function LoginPage() {
  console.log("process.env=", process.env);
  const pageTitle = process.env.REACT_APP_COMPANY_NAME;
  return (
    <>
      <Helmet>
        <title> {`Login | ${pageTitle}`}</title>
      </Helmet>

      <Login />
    </>
  );
}
