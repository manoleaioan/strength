import { React, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { imageUploadStart, resendActivationStart, signOutStart, updateUserStart } from '../../redux/user/user.actions';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selectors';

import { ReactComponent as Upload } from '../../assets/Upload.svg';
import { Button, CircularProgress, Snackbar, Grow } from '@mui/material';
import { InputText } from '../../components/InputText/InputText';
import MuiAlert from '@mui/material/Alert';
import Modal from '../../components/Modal';


import "./UserAccount.scss";
import ThemeSelector from '../../components/Theme/ThemeSelector';

const UserAccount = ({ user, signOut, changeUserPicture, resendActivation, updateUserData }) => {
  const {
    currentUser: { fullName, username, email, verified, _id, profilePicture },
    updateUserError, resendActivation_res
  } = user;
  const [verificationWarning, setVerificationWarning] = useState(true)
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ visible: false, severity: "success" });
  const [userData, setUser] = useState({
    fullName,
    username,
    email,
    password: ""
  })
  const [errors, setErrors] = useState({});
  const [modal, setModalOpen] = useState({
    open: false,
    target: ''
  });
  const close = () => setModalOpen(false);

  useEffect(() => {
    if (resendActivation_res == null) { return; }
    
    if (resendActivation_res === "sent") {
      setVerificationWarning(false);
    }
  }, [resendActivation_res, alert])

  useEffect(() => {
    setIsLoading(false);
    if (updateUserError) {
      if (updateUserError.message){
        setErrors(updateUserError.message);
        const parsedErrors = JSON.parse(updateUserError.message);
        const errors = Object.entries(parsedErrors).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        setErrors(errors);
      }
      else {
        setAlert({ visible: true, severity: "error" });
      }
    } else {
      if(resendActivation_res != null){
        setAlert({ visible: true, severity: "success" });
        close();
      }
    }
  }, [profilePicture, updateUserError, user, resendActivation_res])

  useEffect(() => {
    setErrors({});
    setAlert({ visible: false, severity: "success" });
  }, [])

  const handleFileSelected = async e => {
    const files = Array.from(e.target.files)
    const image = files[0];
    setIsLoading(true);
    changeUserPicture({ file: image });
  }

  const handleChange = event => {
    const { name, value } = event.target;
    setUser({ ...userData, [name]: value });
  };

  const handleUpdateUserData = event => {
    event.preventDefault();
    const input = modal.target
    const value = userData[input]

    let validationErrors = {}

    if (value.trim().length === 0) {
      validationErrors[input] = `${input} required`;
    }

    if (input === "password" && value.length < 8)
      validationErrors.password = 'Password must contain at least 8 characters';

    if (Object.keys(validationErrors).length) {
      return setErrors({
        ...validationErrors,
      });
    }

    updateUserData({ userInput: { [input]: value } });
  }

  const openModal = target => {
    setUser({
      fullName,
      username,
      email,
      password: ""
    });
    setErrors({});
    setModalOpen({ open: true, target });
  };

  const modalMarkup = <Modal onClose={close} open={modal.open}>
    <header>
      Edit account information
    </header>
    <form onSubmit={handleUpdateUserData}>
      <InputText
        type={modal.target === "email" ? "email" : (modal.target === "password" ? "password" : "text")}
        name={modal.target}
        placeholder={modal.target}
        onChange={handleChange}
        value={userData[modal.target]}
        error={errors?.[modal.target]}
      />
      <Button className="save" type="submit">Save</Button>
    </form>
  </Modal>

  return (
    <div className="useraccount-container">
      <div className="header sticky">
        <div id="title">
          <h1>Account</h1>
          <span className="underline"></span>
        </div>
      </div>
      <div id="profile">
        <img src={`${profilePicture?.length > 0 ? profilePicture : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRrydrS0KyakR1BQIr_UB9dfGp_iYWFaBDeQ&usqp=CAU'} `} alt="profileImg" />
        {isLoading && <CircularProgress color="inherit" className='spinner' />}
        <div id="editProfile">
          <label htmlFor="image">
            <Upload />
          </label>
          <input type="file" id="image" name="image" value="" required onChange={handleFileSelected} />
        </div>
        <h1>{fullName}</h1>
        <Snackbar
          open={alert.visible}
          onClose={() => { setAlert({ ...alert, visible: false }) }}
          TransitionComponent={Grow}
          className="err"
          autoHideDuration={4000}
        >
          <MuiAlert variant="filled" severity={alert.severity}>{
            alert.severity === "success"
              ? (resendActivation_res === 'sent' ? "Email sent!" : "User updated!")
              : updateUserError
          }
          </MuiAlert >
        </Snackbar>
      </div>
      {modalMarkup}

      <div id="userInfo">
        {
          (!verified && verificationWarning) && <div className="activate">
            <p>Verify your email to continue!</p>
            <p onClick={() => resendActivation({ uid: _id })}>Resend the activation Link</p>
          </div>
        }
        <div className="field">
          <div>
            <h1>Full Name</h1>
            <p className='capitalize'>{fullName}</p>
          </div>
          <Button onClick={() => openModal("fullName")}>Edit</Button>
        </div>
        <div className="field">
          <div>
            <h1>Username</h1>
            <p className='capitalize'>{username}</p>
          </div>
          <Button onClick={() => openModal("username")}>Edit</Button>
        </div>
        <div className="field">
          <div>
            <h1>Email</h1>
            <p>{email}</p>
          </div>
          <Button className='custom-primary-color' onClick={() => openModal("email")}>Edit</Button>
        </div>
        <div className="field">
          <div>
            <h1>Password</h1>
            <p className="dpw">••••••••</p>
          </div>
          <Button onClick={() => openModal("password")}>Edit</Button>
        </div>
      </div>

      <ThemeSelector />

      <Button className="logoutbtn" onClick={signOut}>Log out</Button>
    </div >
  )
}

const mapStateToProps = createStructuredSelector({
  user: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOutStart()),
  resendActivation: uid => dispatch(resendActivationStart(uid)),
  changeUserPicture: file => dispatch(imageUploadStart(file)),
  updateUserData: userInput => dispatch(updateUserStart(userInput))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAccount);