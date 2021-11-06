import React from "react";
import tyler from './tyler.jpg';
import snow from './snow.jpg';
import leaf from './leaf.jpg';

export default class LeaderboardPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [],
        };
    }

    componentDidMount = async () => {
        const { users } = await this.props.store.getState();
        const list = [];

        try {
            Object.values(users).forEach((user) => {
                let pic;
                switch (user.avatarURL.split('/').pop()) {
                    case 'snow.jpg':
                        pic = snow;
                        break;
                    case 'leaf.jpg':
                        pic = leaf;
                        break;
                    default:
                        pic = tyler;
                }

                list.push({
                    name: user.name,
                    pic,
                    answers: Object.keys(user.answers).length,
                    questions: user.questions.length,
                    get count()  {
                        return this.answers + this.questions;
                    }
                });
            });
            list.sort((a, b) => b.count - a.count);
        } catch (error) {
            console.log(error);
        }
        this.setState({list});
    }

    render = () => (
        <div>
            <br/>
            {this.state.list.map((user) => (
                <div key={user.name}>
                    <img src={user.pic} alt='avatar' width='50px'/>
                    <br/>
                    <span>{user.name}</span>
                    <br/>
                    <span>{`Asked: ${user.questions}`}</span>
                    <br/>
                    <span>{`Answered: ${user.answers}`}</span>
                    <br/>
                    <br/>
                    <br/>
                </div>
            ))}
        </div>
    )
}