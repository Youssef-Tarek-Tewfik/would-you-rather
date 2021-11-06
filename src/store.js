import { createStore } from "redux";
import { _getUsers, _getQuestions, _saveQuestion, _saveQuestionAnswer } from "./_DATA";

const SUBMIT_QUESTION = "SUBMIT_QUESTION";
const SUBMIT_ANSWER = "SUBMIT_ANSWER";
const USER_LOGIN = "USER_LOGIN";
const INITIALIZE = "INITIALIZE";

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

export function initializeStore() {
    return {type: INITIALIZE};
}

export function userLogin(user) {
    return {
        type: USER_LOGIN,
        user,
    };
}

export function customCreateStore() {
    const store = createStore(async (state = {}, action) => {
        switch (action.type) {
            case INITIALIZE:
                return {
                    users: await _getUsers(),
                    questions: await _getQuestions(),
                };

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
    store.dispatch(initializeStore());
    return store;
}