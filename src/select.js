import React from "react";
import { Link } from "react-router-dom";
import "./select.css";

export default class SelectPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
            loaded: false,
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
            this.setState({list, loaded: true});
        }
        catch (e) {
            console.log(e);
        }
    }

    render = () => (
        <div>
            {this.state.loaded? null: <span>Loading</span>}
            <ul>
                {this.state.list.map((i) =>
                    <li key={i.id}>
                        <Link to="/">
                            <button onClick={() => this.buttonHandler(i)}>{i.name}</button>
                        </Link>
                    </li>
                )
                } 
            </ul>
        </div>
    );
}