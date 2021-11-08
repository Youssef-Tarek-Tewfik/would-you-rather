import React from 'react';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import SelectPage from './select';
import QuestionsPage from './questions';
import SubmitPage from './submit';
import LeaderboardPage from './leaderboard';
import DetailsPage from './details';
import NotFoundPage from './notFound';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '',
      displayedName: '',
      detailsId: '',
      redirector: '',
    };
  }

  componentDidMount = () => {}

  selectHandler = (user, displayedName) => {
    this.setState({user, displayedName});
  }

  selectAlert = redirector => {
    if (!this.state.user) {
      alert('Please select a user');
      this.setRedirector(redirector);
    }
  }

  setDetailsId = detailsId => {
    this.setState({detailsId});
  }

  setRedirector = redirector => {
    this.setState({redirector});
  }

  render = () => (
    <BrowserRouter>
      <Link to={this.state.user? '/': '/select'}>
        <button onClick={() => this.selectAlert('/')}>Home</button>
      </Link>
      <Link to={this.state.user? '/add': '/select'}>
        <button onClick={() => this.selectAlert('/add')}>Add</button>
      </Link>
      <Link to='/leaderboard'>
        <button>Leaderboard</button>
      </Link>
      <Link to='/select'>
        <button onClick={() => this.selectHandler('', '')}>{this.state.user? 'Log out': 'Select User'}</button>
      </Link>
      <span>{'Current User: ' + this.state.displayedName}</span>
      <Switch>
        <Route exact path='/' render={() =>
          <QuestionsPage store={this.props.store} user={this.state.user} setDetailsId={this.setDetailsId} setRedirector={this.setRedirector}/>
        }/>
        <Route exact path='/add' render={() =>
          <SubmitPage store={this.props.store} user={this.state.user} setRedirector={this.setRedirector}/>
        }/>
        <Route exact path='/leaderboard' render={() =>
          <LeaderboardPage store={this.props.store}/>
        }/>
        <Route exact path='/select' render={() =>
          <SelectPage store={this.props.store} selectHandler={this.selectHandler} redirector={this.state.redirector}/>
        }/>
        <Route path='/questions' render={() => 
          <DetailsPage store={this.props.store} id={this.state.detailsId} user={this.state.user} setRedirector={this.setRedirector}/>
        }/>
        <Route render={() =>
          <NotFoundPage/>
        }/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
