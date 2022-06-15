import './App.css';
import './i18n';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { history } from './store/main';
import { doFetchUser } from './store/userActions';
import ModalProvider from './store/ModalProvider';
import { getAuthorizationStatus, getLocation } from './store/selectors';
import Sidebar from './components/Sidebar/Sidebar';

import {
  Passports,
  Protocol,
  UnderConstruction,
  Login,
  Passport,
  TechnicalControlDepartment,
  ScanModal,
  Schemas,
  Schema,
} from './pages';
import { ConfirmModal, RemoveProtocolModal } from './components';

import RevisionProvider from './store/RevisionProvider';

function App() {
  const authorized = useSelector(getAuthorizationStatus);
  const dispatch = useDispatch();
  const location = useSelector(getLocation);
  const routes = [
    ['^/$', () => <Login />],
    ['^/passports', () => <Passports />],
    // ['^/Passports', () => <UnderConstruction/>],
    ['^/passport/*', () => <Passport />],
    ['^/tcd/protocol/*', () => <Protocol />],
    ['^/tcd', () => <TechnicalControlDepartment />],
    // ['^/tcd', () => <UnderConstruction/>],
    // ['^/employees', () => <Employees/>],
    ['^/employees', () => <UnderConstruction />],
    // ['^/production-schemas', () => <UnderConstruction/>],
    ['^/production-schemas/schema/*', () => <Schema />],
    ['^/production-schemas', () => <Schemas />],
  ];
  const route = (path) => routes.find((r) => path.match(r[0]) !== null)?.[1]?.();

  useEffect(() => {
    if (
      authorized
      && localStorage.getItem('token') !== undefined
      && localStorage.getItem('token') !== null
    ) {
      doFetchUser(dispatch)
        .then((res) => {
          if (res.status === 200 && location === '/') {
            history.push('/passports');
          } else if (res.status === 401) {
            history.push('/');
          }
        })
        .catch((err) => {
          if (err.response.status === 401) history.push('/');
        });
    }
    if (!authorized) {
      if (
        localStorage.getItem('token') !== undefined &&
        localStorage.getItem('token') !== null
      ) {
        doFetchUser(dispatch)
          .then((res) => {
            if (res.status === 200 && location === '/') {
              history.push('/passports');
            }
          })
          .catch((err) => {
            if (err.response.status === 401 && location !== '/') history.push('/');
          });
      }
      else if (location !== '/') {
          localStorage.setItem('tablePage', '1');
          history.push('/');
        }
    }
  });

  return (
    <ModalProvider>
      <RevisionProvider>
        <ScanModal />
        <ConfirmModal />
        <RemoveProtocolModal />
        <div className="App">
          {location !== '/' && <Sidebar />}
          {route(location)}
        </div>
      </RevisionProvider>
    </ModalProvider>
  );
}

export default App;
