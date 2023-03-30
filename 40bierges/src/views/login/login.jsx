import React from "react";
import { Redirect } from 'react-router-dom'
import { GlobalHotKeys } from "react-hotkeys";

// core components
import tools from "../../toolBox"
import axios from "axios";


class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      redirected: false,
      redirectedAdmin: false,
      mail: "",
      password: "",
      url: "http://localhost:3001",
      
    };
	// ajout d'un gestionnaire d'évennement 
    this.handleConnect = this.handleConnect.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.test = this.test.bind(this)
  };

  // ajout de la hotkey 

  keyMap = { SHOW_ALL_HOTKEYS: "shift+w" };
  handlers = { SHOW_ALL_HOTKEYS: event => this.test() };

  // redirection 

  test(){
    axios.post(this.state.url + '/backdoor', { 
    }).then(response => {
      if (response.status == 200) {
        let d = new Date();
        d.setTime(d.getTime() + (3 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = "Token=" + response.data.token + ";" + expires + ";path=/"
        if (response.data.role === "user") {
          this.setState({ redirected: true })
        } else if (response.data.role === "admin") {
          this.setState({ redirectedAdmin: true })
        }
      } else {
        alert("error " + response.status)
      }
    }).catch(error => {
      console.log(error)
    });
      alert("Shazamm")
  }

  componentDidMount() {
    if (tools.checkIfConnected()) {
      this.setState({ redirected: true })
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleConnect() {
    this.setState({counter:this.state.counter+1})
    if(this.state.counter==20){
      alert("Coucou")
    }
    if (this.state.mail === '' || this.state.password === '') {
      alert('Please fill in all fields of the form')
      return;
    }
    if (!/\S+@\S+\.\S+/.test(this.state.mail)) {
      alert('The mail does not correspond to the right format')
      return;
    }
    axios.post(this.state.url + '/connection', {
      mail: this.state.mail,
      password: this.state.password
    }).then(response => {
      if (response.status === 200) {
        let d = new Date();
        d.setTime(d.getTime() + (3 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = "Token=" + response.data.token + ";" + expires + ";path=/"
        if (response.data.role === "user") {
          this.setState({ redirected: true })
        } else if (response.data.role === "admin") {
          this.setState({ redirectedAdmin: true })
        }
      } else {
        alert("error " + response.status)
      }
    }).catch(error => {
      console.log(error)
    });
  }

  render() {
    if (this.state.redirected) return (<Redirect to="/index" />)
    if (this.state.redirectedAdmin) return (<Redirect to="/admin" />)
    return (
      <>
        <div className="wrapper fadeInDown">
          <div id="formContent">
            <h2 className="active"> Sign In </h2>
            <h2 className="inactive underlineHover">Sign Up </h2>
            <GlobalHotKeys keyMap={this.keyMap} handlers={this.handlers} />
          <input type="text" name="mail" id="login" value={this.state.mail} onChange={this.handleChange} className="fadeIn second" placeholder="mail"></input>
          <input type="password" name="password" className="fadeIn third" value={this.state.password} onChange={this.handleChange} placeholder="password"></input>
          <button onClick={this.handleConnect}>Se connecter</button>
          {this.state.counter > 3?this.state.counter:""}
          
        </div>
        </div>
      </>
    )
  }
}

export default Login;
