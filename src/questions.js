import React from "react";
import { submitAnswer } from "./store";
import { Link, Redirect } from "react-router-dom";
import "./questions.css";

export default class QuestionsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            viewFlag: false,
            suspendVotes: false,
            redirect: "",
        };
    }

    async componentDidMount() {
        if (!this.props.user) {
            alert("No user selected.\nRedirecting...");
            return;
        }
        try {
            const {questions} = await this.props.store.getState();
            this.setState({
                list: Object.values(questions),
                unsub: this.props.store.subscribe(this.updateList),
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    componentWillUnmount() {
        if (this.state.unsub) {
            this.state.unsub();
        }
    }

    updateList = async () => {
        try {
            const {questions} = await this.props.store.getState();
            this.setState({
                list: Object.values(questions),
            });
        } catch (e) {
            console.log("error updating questions");
        }
        setTimeout(() => alert("Vote Successful"), 0);
        this.setState({suspendVotes: false});
    }

    polled = i => {
        return i.optionOne.votes.includes(this.props.user) || i.optionTwo.votes.includes(this.props.user);
    }

    btnColor = (i, option) => {
        if (!this.polled(i))
            return '';
        return i[option].votes.includes(this.props.user)? "green": "";
    }

    voteHandler = async (id, option, e) => {
        console.log(option);
        if (this.state.suspendVotes) {
            alert("Vote in progress please wait");
            return
        }
        this.setState({suspendVotes: true});
        e.target.className = "green";
        this.props.store.dispatch(submitAnswer(this.props.user, id, option));
        this.props.setDetailsId(id)
        this.setState({redirect: id});
    }

    setView = viewFlag => {
        this.setState({viewFlag});
    }

    listElement = element => {
        if (this.polled(element) !== this.state.viewFlag) {
            return null;
        }
        if (this.polled(element)) {
            return <div key={element.id}>
                <div className={element.optionOne.votes.includes(this.props.user)? "green": ""}>{element.optionOne.text}</div>
                <div className={element.optionTwo.votes.includes(this.props.user)? "green": ""}>{element.optionTwo.text}</div>
                <Link to={"/questions/" + element.id}>
                    <button onClick={() => this.props.setDetailsId(element.id)}>Details</button>
                </Link>
                <br/>
                <br/>
            </div>;
        }
        return <div key={element.id}>
            <span style={{fontSize: '1.25em'}}>{element.optionOne.text}</span>
            <br/>
            <span> or </span>
            <br/>
            <span style={{fontSize: '1.25em'}}>{element.optionTwo.text}</span>
            <br/>
            <Link to={"/questions/" + element.id}>
                <button onClick={() => this.props.setDetailsId(element.id)}>Details</button>
            </Link>
            <br/>
            <br/>
            <br/>
        </div>;
    }

    render = () => (
        <div>
            {this.props.user? null: <Redirect to='/select'/>}
            {(!this.state.suspendVotes && this.state.redirect)? <Redirect to={'/questions/' + this.state.redirect}/>: null}
            <br/>
            <button disabled={this.state.viewFlag} onClick={() => this.setView(true)}>Polled</button>
            <button disabled={!this.state.viewFlag} onClick={() => this.setView(false)}>Unpolled</button>
            <br/>
            <br/>
            {this.state.list.reverse().map(i => this.listElement(i))}
        </div>
    )
}