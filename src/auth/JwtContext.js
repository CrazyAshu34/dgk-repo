import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';
// utils
import api from '../services/api';
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// export const AuthContext = createContext({
//   ...initialState,
//   method: 'jwt',
//   login: () => Promise.resolve(),
//   logout: () => Promise.resolve(),
//   register: () => Promise.resolve(),
// });

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';
      const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';
      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken, userId);
        // console.log("userId=",userId);
        // const response = await axios.get('/api/account/my-account');
        const response = await api.get(`/adminuser/loginwithid/${userId}`);
        console.log("onedata=>", response.data);
        const { user } = response.data;

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [storageAvailable]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(
    async (username, password) => {
      // const response = await axios.post('/adminuser/login', {
      const response = await api.post('/adminuser/login', {
        username,
        password,
      });

      const { accessToken, user } = response.data;
      // console.log('response.data', user._id);
      setSession(accessToken, user._id);

      initialize();
      window.location.reload(true);
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    },
    [initialize]
  );

  // const login = useCallback(async (email, password) => {
  //   const response = await axios.post('/api/account/login', {
  //     email,
  //     password,
  //   });
  //   const { accessToken, user } = response.data;

  //   setSession(accessToken);

  //   dispatch({
  //     type: 'LOGIN',
  //     payload: {
  //       user,
  //     },
  //   });
  // }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user } = response.data;

    localStorage.setItem('accessToken', accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      method: 'jwt',
      login,
      register,
      logout,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, login, logout, register]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
