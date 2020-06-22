import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import CardService from '../services/cardService';
import { userService } from '../services/userService';
import { Card } from '../models/card';
import LearnStatusService from '../services/learnStatusService';
import '../App.css';
import { actionTypes } from '../redux/actionTypes';

const mapStateToProps = (state) => {
    return {
        userState: state.userState,
        userName: state.userName,
        cards: state.cards,
        statuses: state.statuses,
        folderName: state.currentFolder,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getCards: (cards) => dispatch(actionTypes.getCards(cards)),
        getStatuses: (statuses) => dispatch(actionTypes.getStatuses(statuses)),
        updateCardOnFrontend: (card) => dispatch(actionTypes.updateCardOnFrontend(card)),
        deleteCardFromFrontend: (card) => dispatch(actionTypes.deleteCardFromFrontend(card)),
        deleteStatusFromFrontend: (status) => dispatch(actionTypes.deleteStatusFromFrontend(status))
    }
}

function AddCardForm(props) {
    return (
        <form id="add-new-card">
            <label for="wordToLearn" class="wordToLearn">Word</label>
            <input 
                type="text" 
                name="wordToLearn" 
                value="" 
                id="wordToLearn" 
            />
            <label for="wordTranslate" class="wordTranslate">Translate</label>
            <input 
                type="text" 
                name="wordTranslate" 
                value="" 
                id="wordTranslate" 
            />
            <label> Add tags (separated by commas)
                <input 
                    type="text" 
                    name="tags" 
                    value="" 
                />
            </label>
            <button id="send-new-card" data-formid="add-new-card">Send</button>
        </form>
    );
}

function UpdateCardForm(props) {
    const folder = props.folderName;
    const card = props.populatedCards[folder].find(item => item.id === props.cardId);
    const tags = card.tags.size > 1 
                ? Array.from(card.tags).join(', ')
                : Array.form(card.tags);
    return (
        <form id="update-card">
            <label for="wordToLearn" class="wordToLearn">Word</label>
            <input 
                type="text" 
                name="wordToLearn" 
                value={card.wordToLearn} 
                id="wordToLearn"
                onChange = { props.onChangeInputFormUpdateCard } 
            />
            <label for="wordTranslate" class="wordTranslate">Translate</label>
            <input 
                type="text" 
                name="wordTranslate" 
                value={card.wordTranslate} 
                id="wordTranslate"
                onChange = { props.onChangeInputFormUpdateCard } 
            />
            <label> Tags (separated by commas)
                <input 
                    type="text" 
                    name="tags" 
                    value={tags}
                    onChange = { props.onChangeInputFormUpdateCard } 
                />
            </label>
            <button id="send-update-card">Send update</button>
        </form>
    );
}

function AddFolderForm(props) {
    return (
        <form id="additionFolderName">
            <label className="folderName" for="folderName"></label>
            <input type="text" id="folderName" name="folderName" value="" />
            <button data-formid="additionFolderName" id="add-new-folder" type="button">Add</button>
        </form>
    );
}

function RenderFolders(props) {
    if (props.folderName !== 'root') {
        return null;
    }

    const data = Object.keys(props.populatedCards);

    const folders = data.map((item) => {
            if (item === 'root') {
                return null;
            }
            return (<div className="folder" key={item}>{item}</div>);
        }
    );

    return <div>{folders}</div>;
}

function RenderTagsInCard(props) {
    const data = Array.from(props.tags);

    const tags = data.map((item) => 
        <span className="tag" data-folder={props.folderName} data-id={props.id} data-tag={item} key={item}>{item}</span>
    );

    return <div>{tags}</div>
}

function RenderBodyWithCards(props) {
    const data = props.populatedCards[props.folderName];

    const cards = data.map((item) => {
        return (
            <div class="word" key={item.id}>
                <p className="wordToLearn">{item.wordToLearn}</p>
                <p className="wordTranslate">{item.wordTranslate}</p>
                {item.tags.size && <RenderTagsInCard 
                    folderName = { props.folderName }
                    id = {item.id}
                    tags = {item.tags}
                />}
                <button id="update-card" onClick={props.onClickUpdateCard} data-folder={props.folderName} data-id={item.id} type="button">Update</button>
                <button className="delete-card" onClick={props.onClickDeleteCard} data-folder={props.folderName} data-id={item.id} type="button">Delete</button>
            </div>
            )
        }
    );

    return (<div className={props.folderName}>{cards}</div>);
}

class BodyApp extends Component{
    constructor(props) {
        super(props);

        this.state = {
            addCardFormVisible: false,
            addFolderFormVisible: false,
            updateCardFormVisible: false,
            changeableCardId: '',
            updateCardForm: {},
            addCardForm: {},
            populatedCards: {},
            populatedStatuses: {}
        };
    }

    async componentDidMount() {
        console.log('componentDidMountBody');
        if (localStorage.getItem('sessionToken')) {
            console.log('componentDidMountBodyToken');
            const cards = await CardService.getCardsFromServer();
            console.log(cards);
            const statuses = await LearnStatusService.getLearnStatusesFromServer();
            if (cards.length) {
                this.props.getCards(cards);
                this.props.getStatuses(statuses);
                const cardsInFolderds = CardService.populateCards(cards);
                console.log(cardsInFolderds);
                const statusesInFolders = LearnStatusService.populateStatuses(statuses);
                this.setState({
                    populatedCards: cardsInFolderds,
                    populateStatuses: statusesInFolders
                })
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {

    }

    onChangeInputFormUpdateCard = (event) => {
        this.setState({
            updateCardForm: {
                ...this.state.updateCardForm,
                [event.target.name]: event.target.value
            }
        });
    }

    onChangeInputFormAddCard = (event) => {
        this.setState({
            updateCardForm: {
                ...this.state.addCardForm,
                [event.target.name]: event.target.value
            }
        });
    }

    onClickAddCard = (event, data) => {
        event.preventDefault();
        this.setState({ 
            addCardFormVisible: !this.state.addCardFormVisible,
            addCardForm: {
                folderName: this.props.folderName
            } 
        });
    }

    onClickAddFolder = (event, data) => {
        event.preventDefault();
        this.setState({ addFolderFormVisible: !this.state.addFolderFormVisible });
    }

    onClickDeleteCard = async (event, data) => {
        event.preventDefault();
        const id = event.target.dataset.id;
        const status = this.state.populatedStatuses[this.props.folderName].find(item => item.cardId === id);
        const card = this.state.populatedCards[this.props.folderName].find(item => item.id === id);
        await CardService.deleteCard(id);
        await LearnStatusService.deleteLearnStatus(status.id);
        const newCards = this.state.populatedCards[this.props.folderName].filter(item => item.id !== card.id);
        const newStatuses = this.state.populatedStatuses[this.props.folderName].filter(item => item.id !== status.id);
        this.setState({
            populatedCards: newCards,
            populatedStatuses: newStatuses
        })

    }

    onClickUpdateCard = (event, data) => {
        event.preventDefault();
        this.setState({
            changeableCardId: event.target.dataset.id,
            updateCardFormVisible: ! this.state.updateCardFormVisible,
            updateCardForm: {
                folderName: this.props.folderName
            }
        });
    }

    onClickSendUpdatedCard = (event) => {
        event.preventDefault();
        const cards = this.state.populatedCards[this.props.folderName];
        cards.forEach(async (el, i) => {
            if (el.id === this.state.changeableCardId) {
                let cardData = {
                    ...el,
                    ...this.state.updatedCardForm
                };

                const card = new Card(cardData);

                await card.updateCard(localStorage.getItem('sessionToken'));
                this.props.updateCardOnFrontend(card);
                this.setState({
                    changeableCardId: '',
                    updatedCardForm: {},
                });
            }
        });

    }

    // onClickSendNewCard = async (event, data) => {
    //     event.preventDefault();

    //     const card = await CardService.createCard(this.state.addCardForm);
    //     const status = await LearnStatusService.createLearnStatus(
    //         card.id,
    //         card.folderName,
    //     );

    //     const populatedCards = CardService.populateCard(
    //         card, 
    //         this.state.populatedCards
    //     );
    //     const populatedStatuses = LearnStatusService.populateStatus(
    //         status, 
    //         this.state.populatedStatuses
    //     );

    //     this.props.addCards(populatedCards);
    //     this.props.addStatuses(populatedStatuses);
    // }
    
    render() {
        if (this.props.userState === 'notAuthorized') {
            return (
                <body>
                    <h1>Welcome to us</h1>
                    <div className='wrapper'>

                    </div>
                </body>
            );
        }

        return (
            <body>
                <h1>Welcome to us</h1>
                <div className='wrapper'>
                    <button
                        data-folder={this.props.folderName}
                        id="add-card"
                        onClick={this.onClickAddCard}
                    >Add card</button> 

                    { this.props.folderName !== 'root' 
                    ? (
                        <React.Fragment>
                            <h2>{this.props.folderName}</h2>
                            <button onClick={this.onClickHomeButton}>Home</button>
                        </React.Fragment>
                    )
                    : (
                        <button onClick={this.onClickAddFolder}>
                            <span>Add folder</span>
                        </button>
                    )} 
                    
                    {/* { (this.state.populatedCards[this.props.folderName].length) > 4 && 
                        <Link to = '/training'>
                            <button 
                                data-folder={this.props.folderName}
                                >Start training
                            </button>
                        </Link>
                    } */}

                    {this.state.addCardFormVisible && <AddCardForm 
                        addCardForm = { this.state.addCardForm }
                        onChangeInputFormAddCard = { this.onChangeInputFormAddCard }
                        onChangeSendNewCard = { this.onClickSendNewCard } 
                    />}

                    {this.state.addFolderFormVisible && <AddFolderForm />}

                    {this.state.updateCardFormVisible && <UpdateCardForm 
                        folderName = { this.props.folderName }
                        populatedCards = { this.state.populatedCards }
                        onChangeInputFormUpdateCard = { this.onChangeInputFormUpdateCard }
                        updateCardForm = { this.state.updateCardForm }
                        onChangeSendUpdatedCard = { this.onClickSendUpdatedCard }
                    />}

                    {Object.keys(this.state.populatedCards).length > 1  && <RenderFolders
                        folderName = { this.props.folderName }
                        populatedCards = { this.state.populatedCards }
                    />}

                    {Object.keys(this.state.populatedCards).length !== 0  && <RenderBodyWithCards
                        folderName = { this.props.folderName }
                        populatedCards = { this.state.populatedCards }
                        onClickUpdateCard = { this.onClickUpdateCard }
                        onClickDeleteCard = { this.onClickDeleteCard }
                    />} 
                </div>
            </body>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
    )(BodyApp);