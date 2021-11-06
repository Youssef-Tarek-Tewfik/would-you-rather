import React from 'react';
import { Redirect } from 'react-router';
import tyler from './tyler.jpg';
import snow from './snow.jpg';
import leaf from './leaf.jpg';
import './questions.css';

export default class DetailsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            author: '',
            pic: './tyler.jpg',
            picSrc: tyler,
            optionOne: '',
            optionTwo: '',
            optionOneVotes: [],
            optionTwoVotes: []
        };
    }

    componentDidMount = async () => {
        const { questions, users } = await this.props.store.getState();
        if (!questions || !users) {
            return;
        }
        
        const question = questions[this.props.id];
        if (question) {
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
        }
    }

    render = () => (
        <div>
            {this.props.id? null: <Redirect to='/404'/>}
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
            </div>
            <br/>
            {this.state.optionTwoVotes.map(e =>
                <span key={e}>{e}<br/></span>
            )}
        </div>
    )
}