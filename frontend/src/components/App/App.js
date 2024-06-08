import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { checkUserSessionStart } from '../../redux/user/user.actions';

import Account from '../../pages/Account/Account';
import DynamicRoute from '../DynamicRoute';
import SplashScreen from '../SplashScreen/SplashScreen';
import AppContainer from '../AppContainer/AppContainer';

import './App.scss';

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<DynamicRoute component={Account} guest />} />
      <Route exact path="/login" element={<DynamicRoute component={Account} guest />} />
      <Route exact path="/register" element={<DynamicRoute component={Account} guest />} />
      <Route exact path="/password-reset" element={<DynamicRoute component={Account} guest />} />
      <Route exact path="/password-reset/confirm/:token" element={<DynamicRoute component={Account} guest />} />
      <Route exact path="/verify/:token" element={<DynamicRoute component={Account} />} />
      <Route exact path="/account" element={<DynamicRoute component={AppContainer} authenticated />} />
      <Route exact path="/exercises" element={<DynamicRoute component={AppContainer} authenticated />} />
      <Route exact path="/routines" element={<DynamicRoute component={AppContainer} authenticated />} />
      <Route exact path="/workouts" element={<DynamicRoute component={AppContainer} authenticated />} />
      <Route exact path="/workouts" element={<DynamicRoute component={AppContainer} authenticated />} />
      <Route exact path="*" element={<DynamicRoute component={AppContainer} authenticated />} />
    </Routes>
  </BrowserRouter>
);

const App = ({ user, checkUserSession }) => {
  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  return SplashScreen(Router)({ isLoading: user.isLoading });
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
  checkUserSession: () => dispatch(checkUserSessionStart())
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(App);