import React from 'react'
import { Navigate } from 'react-router-dom'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../redux/user/user.selectors';

const DynamicRoute = ({ user, ...props }) => {
  const { currentUser } = user;

  if (props.authenticated && !currentUser) {
    return <Navigate to="/login" />
  } else if (props.guest && currentUser) {
    return <Navigate to="/workouts" />
  } else {
    return <props.component {...props} />
  }
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser
});

export default connect(
  mapStateToProps,
  null
)(DynamicRoute);