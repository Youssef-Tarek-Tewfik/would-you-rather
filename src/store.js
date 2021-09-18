import { createStore } from "redux";
import { _getUsers, _getQuestions, _saveQuestion, _saveQuestionAnswer } from "./_DATA";

const SUBMIT_QUESTION = "SUBMIT_QUESTION";
const SUBMIT_ANSWER = "SUBMIT_ANSWER";
const USER_LOGIN = "USER_LOGIN";

export function submitQuestion(author, optionOneText, optionTwoText) {
    return {
        type: SUBMIT_QUESTION,
        author,
        optionOneText,
        optionTwoText,
    };
}

export function submitAnswer(authedUser, qid, answer) {
    return {
        type: SUBMIT_ANSWER,
        authedUser,
        qid,
        answer,
    };
}

export function userLogin(user) {
    return {
        type: USER_LOGIN,
        user,
    };
}

export async function customCreateStore() {
    const users = await _getUsers();
    const questions = await _getQuestions();

    const initialState = {
        users,
        questions,
    };

    return createStore(async (state = initialState, action) => {
        switch (action.type) {
            case SUBMIT_QUESTION:
                await _saveQuestion(action);
                return {
                    users: await _getUsers(),
                    questions: await _getQuestions(),
                };
                
            case SUBMIT_ANSWER:
                await _saveQuestionAnswer(action);
                return {
                    users: await _getUsers(),
                    questions: await _getQuestions(),
                };

            default:
                return state;
        }
    });
}