import React from "react";
import { Redirect } from "react-router-dom";
import "./select.css";

export default class SelectPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
        };
    }

    buttonHandler = user => {
        this.props.selectHandler(user.id, user.name);
    }

    componentDidMount = async () => {
        try {
            const {users} = await this.props.store.getState();
            const list = [];
            for (let user in users) {
                const {id, name} = users[user];
                list.push({id, name});
            }
            this.setState({list});
        }
        catch (e) {

        }
    }

    render = () => (
        <div>
            <ul>
                {this.state.list.map((i) =>
                    <li key={i.id}>
                        <button onClick={() => this.buttonHandler(i)}>{i.name}</button>
                    </li>
                )} 
            </ul>
        </div>
    );
}