import React from "react";
import { BrowserRouter, Link, Redirect, Route } from "react-router-dom";
import { customCreateStore } from "./store";
import SelectPage from "./select";
import QuestionsPage from "./questions";
import SubmitPage from "./submit";
import "./App.css";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: "",
      displayedName: "",
    };
  }

  componentDidMount = async () => {
    this.setState({store: await customCreateStore()});
    // this.state.store
  }

  selectHandler = (user, displayedName) => {
    this.setState({user, displayedName});
  }

  render = () => (
    <BrowserRouter>
    <Redirect to="/"/>
      <Link to="/questions">
        <button>Questions</button>
      </Link>
      <Link to="/submit">
        <button>Submit</button>
      </Link>
      <Link to="/select">
        <button>Select User</button>
      </Link>
      <span>{this.state.user? "Current User: " + this.state.displayedName: ""}</span>
      <Route exact path="/select" render={() =>
        <SelectPage store={this.state.store} selectHandler={this.selectHandler}/>
      }/>
      <Route exact path="/questions" render={() =>
        <QuestionsPage store={this.state.store} user={this.state.user}/>
      }/>
      <Route exact path="/submit" render={() =>
        <SubmitPage store={this.state.store} user={this.state.user}/>
      }/>
    </BrowserRouter>
  );
}

export default App;
