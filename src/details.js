import React from 'react';
import { Redirect } from 'react-router';
import { submitAnswer } from "./store";
import tyler from './tyler.jpg';
import snow from './snow.jpg';
import leaf from './leaf.jpg';
import './questions.css';

export default class DetailsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.getId(),
            author: '',
            pic: './tyler.jpg',
            picSrc: tyler,
            optionOne: '',
            optionTwo: '',
            optionOneVotes: [],
            optionTwoVotes: [],
            unsub: null,
            canVote: false,
            suspendVotes: false,
            unrecognized: false,
            loginRedirect: false
        };
    }

    componentDidMount = async () => {

        if (!this.props.user) {
            alert('No user selected\nRedirecting...');
            this.props.setRedirector(window.location.pathname);
            this.setState({loginRedirect: true});
            return;
        }

        const { questions, users } = await this.props.store.getState();
        if (!questions || !users) {
            alert('Error fetching data');
            return;
        }
        
        const question = questions[this.state.id];
        if (!question) {
            alert('Question Not Found');
            this.setState({unrecognized: true});
            return;
        }

        this.setState({
            author: question.author,
            pic: users[question.author]['avatarURL'].split('/').pop(),
            optionOne: question.optionOne.text,
            optionTwo: question.optionTwo.text,
            optionOneVotes: question.optionOne.votes,
            optionTwoVotes: question.optionTwo.votes
        });
        switch (this.state.pic) {
            case 'snow.jpg':
                this.setState({picSrc: snow});
                break;
            case 'leaf.jpg':
                this.setState({picSrc: leaf});
                break;
            default:
        }
        if (this.state.optionOneVotes.includes(this.props.user) || this.state.optionTwoVotes.includes(this.props.user)) {
            this.setState({canVote: false});
        }
        else {
            this.setState({
                canVote: true,
                unsub: this.props.store.subscribe(this.updateLists),
            });
        }
    }

    componentWillUnmount() {
        this.state.unsub && this.state.unsub();
    }

    getId = () => {
        let id = window.location.pathname.split('questions/').pop();
        if (id.endsWith('/')) {
            id = id.substr(0, id.length - 1);
        }
        return id;
    }

    updateLists = async () => {
        try {
            const { questions } = await this.props.store.getState();
            const question = questions[this.state.id];
            this.setState({
                optionOneVotes: question.optionOne.votes,
                optionTwoVotes: question.optionTwo.votes,
                canVote: false
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    voteHandler = option => {
        if (this.state.suspendVotes) {
            alert("Vote in progress please wait");
            return
        }
        this.setState({suspendVotes: true});
        this.props.store.dispatch(submitAnswer(this.props.user, this.state.id, option));
    }

    render = () => (
        <div>
            {this.state.unrecognized? <Redirect to='/404'/>: null}
            {this.state.loginRedirect? <Redirect to='/select'/>: null}
            <br/>
            <span style={{fontSize: '2em'}}>Would you rather</span>
            <br/>
            <img src={this.state.picSrc} width='100px'alt='profile pic'></img>
            <br/>
            <span>By {this.state.author}</span>
            <br/>
            <br/>
            <div className={this.state.optionOneVotes.includes(this.props.user)? "green": ""}>
                <span>
                    {this.state.optionOne + ' (votes: ' + this.state.optionOneVotes.length + ' | '}
                    {(100 * (this.state.optionOneVotes.length / ( this.state.optionOneVotes.length + this.state.optionTwoVotes.length))).toFixed(1) || '0'}%
                    {'):'}
                </span>
                <button disabled={!this.state.canVote || this.state.suspendVotes} onClick={() => this.voteHandler('optionOne')}>Vote</button>
            </div>
            <br/>
            {this.state.optionOneVotes.map(e =>
                <span key={e}>{e}<br/></span>
                )}
            <br/>
            <br/>
            <div className={this.state.optionTwoVotes.includes(this.props.user)? "green": ""}>
                <span>
                    {this.state.optionTwo + ' (votes: ' + this.state.optionTwoVotes.length + ' | '}
                    {(100 * (this.state.optionTwoVotes.length / ( this.state.optionOneVotes.length + this.state.optionTwoVotes.length))).toFixed(1) || '0'}%
                    {'):'}
                </span>
                <button disabled={!this.state.canVote || this.state.suspendVotes} onClick={() => this.voteHandler('optionTwo')}>Vote</button>
            </div>
            <br/>
            {this.state.optionTwoVotes.map(e =>
                <span key={e}>{e}<br/></span>
            )}
        </div>
    )
}