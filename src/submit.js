import React from "react";
import { submitQuestion } from "./store";
import { Redirect } from "react-router";

export default class SubmitPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            success: false,
            optionA: "",
            optionB: "",
        };
    }

    componentDidMount = () => {
        if (!this.props.user) {
            alert("No user selected.\nRedirecting...");
        }
    }

    optionAHandler = e => {
        this.setState({optionA: e.target.value});
    }
    
    optionBHandler = e => {
        this.setState({optionB: e.target.value});
    }

    confirmHandler = e => {
        if (!this.props.user) {
            alert("Please select a user");
        }
        else if (this.props.store && this.state.optionA && this.state.optionB) {
            this.props.store.dispatch(submitQuestion(this.props.user, this.state.optionA, this.state.optionB));
            this.setState({success: true});
            alert("Success");
        }
        else {
            alert("Error\nMake sure the fields are not blank");
        }
    }

    render = () => (
        <div>
            {this.props.user? null: <Redirect to='/select'/>}
            {this.state.success && <Redirect to='/'/>}
            <br/>
            <span>Would you rather</span>
            <br/>
            <input onChange={this.optionAHandler} placeholder="Option A"></input>
            <br/>
            <span>or</span>
            <br/>
            <input onChange={this.optionBHandler} placeholder="Option B"></input>
            <button onClick={this.confirmHandler}>Confirm</button>
        </div>
    );
}