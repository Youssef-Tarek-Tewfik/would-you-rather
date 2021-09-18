import React from "react";
import "./questions.css";
import { submitAnswer } from "./store";

export default class QuestionsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {list: []};
    }

    async componentDidMount() {
        if (!this.props.user) {
            console.log("No user selected");
            return;
        }
        try {
            const {questions} = await this.props.store.getState();
            this.setState({
                list: Object.values(questions),
                unsub: this.props.store.subscribe(this.updateList),
            });
        } catch (e) {
            console.log("error mounting questions");
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
    }

    btnDisabled = (i) => {
        return i.optionOne.votes.includes(this.props.user) || i.optionTwo.votes.includes(this.props.user);
    }

    btnColor = (i, option) => {
        if (!this.btnDisabled(i))
            return '';
        return i[option].votes.includes(this.props.user)? "green": "";
    }

    voteHandler = async (id, option, e) => {
        e.target.className = "yellow";
        this.props.store.dispatch(submitAnswer(this.props.user, id, option));
    }

    render = () => (
        <div>
            <br/>
            <br/>
            {this.state.list.map((i) => 
                <div key={i.id}>
                    <span>Would you rather</span>
                    <button onClick={(e) => this.voteHandler(i.id, "optionOne", e)} className={this.btnColor(i, "optionOne")} disabled={this.btnDisabled(i)}>{i.optionOne.text}</button>
                    <span>or</span>
                    <button onClick={(e) => this.voteHandler(i.id, "optionTwo", e)} className={this.btnColor(i, "optionTwo")} disabled={this.btnDisabled(i)}>{i.optionTwo.text}</button>
                </div>
            )}
        </div>
    )
}