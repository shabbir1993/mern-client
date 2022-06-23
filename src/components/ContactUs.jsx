import React, {useState,useRef} from "react";
//import {TextField, Button} from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {makeStyles} from "@material-ui/core/styles";
import {submitMessageApi} from "../config/WebService";
import axios from 'axios';
import Swal from 'sweetalert2';

const useStyles = makeStyles(theme => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "50vh", 
    }
  }
}));

function CountactUs() {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState([]);
  const [showErrors, setShowErrors] = useState(false);

  const emailInput = useRef(null);
  const nameInput= useRef(null);
  const messageInput= useRef(null); 

  let errors = [];
  function ValidateEmail(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  }

  const formValidation = () => {
    setErrorMessages([]);

    const isNameValid = name !== "";
    const isMessageValid = message !== "";
    
    if (!isNameValid) {
      errors.push("Name is not valid, please try again.");
    }
    if (!ValidateEmail(email)) {
      errors.push("Email is not valid, please try again.");
    }
    if (email === "") {
      errors.push("Email field is empty, please try again.");
    }
    if (!isMessageValid) {
      errors.push("Message is not valid, please try again.");
    }
    
    if (errors.length > 0) {
      setShowErrors({ showErrors: true });
      setErrorMessages(errors);
    } else {
      setShowErrors({ showErrors: false });
      submitMessage();
      // call API
      //alert("Email Sent");
    }
  };

  const resetForm = () => {
    setEmail("");
    setName(""); 
    setMessage("");
    nameInput.current.value = "";
    emailInput.current.value = "";
    messageInput.current.value = "";
    setErrorMessages([]);
    setShowErrors(false);
  }

  const submitMessage = async() => {
    const url = submitMessageApi;

    const payload= {
      name,
      email,
      message,
    };

    try {let res = await axios.post(url, payload);
      if(res.status === 200) {
        Swal.fire(
          'Message Sent!',
          'Message Successfully Sent!',
          'success'
        );
        resetForm();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Unable to send message',
          text: 'Something went wrong!',
        });
      }}
    catch (e) {
      Swal.fire({
        icon: 'error',
        title: 'Unable to send message',
        text: 'Something went wrong!',
      });
    }
  }

  return (
    <div className="container">
      <div className="outerFormContainer">
        <div className="innerFormContainer">
          <h2> Contact Us </h2>
          <form className={classes.root}>
            <TextField
              label="Full Name"
              placeholder="Jane Doe"
              type="text"
              variant="outlined"
              onChange={e => setName(e.target.value)}
              inputRef={nameInput}
            />
            <br />
            <TextField
              label="Email"
              placeholder="janedoe@gmail.com"
              type="email"
              variant="outlined"
              onChange={e => setEmail(e.target.value)}
              inputRef={emailInput}
            />
            
            <br />
            <TextField
              label="Message"
              placeholder="Type your message"
              type="text"
              variant="outlined"
              multiline
              rowsMax="5"
              onChange={e => setMessage(e.target.value)}
              inputRef={messageInput}
            />
            <br />
            {showErrors
              ? errorMessages.map((item, index) => {
                  return <ul style = {{color : 'red'}} key={index}>{item}</ul>;
                })
              : null}
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={formValidation}
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default CountactUs;
