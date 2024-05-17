import { Route, Navigate} from 'react-router-dom'

function PrivateRoute({ element: Element, isLoggedIn, ...rest }) {
    return (
      <Route
        {...rest}
        element={isLoggedIn ? <Element /> : <Navigate to="/login" replace />}
      />
    );
  }
  

export default PrivateRoute