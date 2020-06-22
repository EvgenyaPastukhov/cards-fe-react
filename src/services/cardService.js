import ky from 'ky';
import { Card } from '../models/card.js';
import { url } from '../App';

export default class CardService {
    // static populateCards(allCards) {
    //     const populatedCards = {};
    //     for (let entry of allCards) {
    //         if (! Object.keys(populatedCards).includes(entry.folderName)) {
    //             populatedCards[entry.folderName] = [];
    //             entry.tags = new Set(entry.tags);
    //             const card =  new Card (entry);

    //             populatedCards[entry.folderName].push(card);
    //         } else {
    //             entry.tags = new Set(entry.tags);
    //             const card =  new Card (entry);

    //             populatedCards[entry.folderName].push(card);
    //         }
    //     }

    //     return populatedCards;
    // }

    // static populateCard(card, wordsInFolders) {
    //     if (! Object.keys(wordsInFolders).includes(card.folderName)) {
    //         wordsInFolders[card.folderName] = [];
    //         wordsInFolders[card.folderName].push(card);
    //     } else {
    //         wordsInFolders[card.folderName].push(card);
    //     }

    //     return wordsInFolders;
    // }

    static async createCard(data) {
        const sessionToken = localStorage.getItem('sessionToken');

        const cardData = {
            word: data.wordToLearn,
            translate: data.wordTranslate,
            tags: data.tags,
            folderName: data.folderName,
        }

        try {
            const response = await ky.post(url + '/cards', {
                headers: {
                    Authorization: sessionToken,
                    'content-type': 'application/json'
                },
                body: JSON.stringify(cardData),
                mode: 'cors'
            }).json();

            cardData.id = response.id;

            const card = new Card(cardData);

            return card;

        } catch (e) {
            console.log('Error occurred while executing a request for create card ' + e);
            console.log(e);
        }
    }

    static async deleteCard(id) {
        const sessionToken = localStorage.getItem('sessionToken');
        try {
            ky.delete(url + '/cards/' + id, {
                headers: {
                    Authorization: sessionToken,
                    'content-type': 'application/json'
                },
                mode: 'cors'
            });

        } catch (e) {
            console.log('Error occurred while executing a request for remove card ' + e);
            console.log(e);
        }
    }
   
    static async getCardsFromServer() {
        const sessionToken = localStorage.getItem('sessionToken');

        try {
            return ky.get(url + '/cards', {
                headers: {
                    Authorization: sessionToken,
                    'content-type': 'application/json'
                }
            }).json();

        } catch (e) {
            console.log('an error occurred while executing a request for receiving all cards ' + e);
        }
    }

    static deleteTagFromAllCards(myCards, tag) {
        const sessionToken = localStorage.getItem('sessionToken');
        myCards.filter(item => item.tags != null)
            .map(async item => {
                const result = item.tags.delete(tag);
                if (result) {
                    await item.deleteTag(sessionToken, tag);
                    console.log(item);
                    return item;
                }
                return item;
            });
    }
}
