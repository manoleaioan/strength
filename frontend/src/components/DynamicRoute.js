import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../redux/user/user.selectors';

const DynamicRoute = ({ user, ...props }) => {
  const { currentUser } = user;

  if (props.authenticated && !currentUser) {
    return <Redirect to="/login" />
  } else if (props.guest && currentUser) {
    return <Redirect to="/account" />
  } else {
    return <Route component={props.component} {...props} />
  }
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser
});

export default connect(
  mapStateToProps,
  null
)(DynamicRoute);