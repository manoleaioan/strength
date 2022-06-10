import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Redirect } from "react-router-dom";
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
    <Switch>
      <DynamicRoute exact path="/" component={Account} guest />
      <DynamicRoute exact path="/login" component={Account} guest />
      <DynamicRoute exact path="/register" component={Account} guest />
      <DynamicRoute exact path="/password-reset" component={Account} guest />
      <DynamicRoute exact path="/password-reset/confirm/:token" component={Account} guest />
      <DynamicRoute exact path="/verify/:token" component={Account} />
      <DynamicRoute exact path="/account" component={AppContainer} authenticated />
      <DynamicRoute exact path="/exercises" component={AppContainer} authenticated />
      <DynamicRoute exact path="/routines" component={AppContainer} authenticated />
      <DynamicRoute path="*" authenticated>
        <Redirect to="/account" />
      </DynamicRoute>
    </Switch>
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