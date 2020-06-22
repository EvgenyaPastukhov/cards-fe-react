import ky from 'ky';

export class Card {
    constructor(data) {
        this.id = data.id;
        this.wordToLearn = data.wordToLearn;
        this.wordTranslate = data.wordTranslate;
        this.tags = data.tags;
        this.folderName = data.folderName;
    }

    stringifyCard() {
        return {
            id: this.id,
            wordToLearn: this.wordToLearn,
            wordTranslate: this.wordTranslate,
            tags: this.tags,
            folderName: this.folderName
        };
    }
  
    async updateCard(sessionToken) {
        const cardToUpdate = this.stringifyCard();

        try {
            await ky.put('/cards/' + this.id,{
                headers: {
                    Authorization: sessionToken,
                    'content-type': 'application/json'
                }, 
                body: JSON.stringify(cardToUpdate)
            }).json();

        } catch(e) {
            console.log('Error occurred while executing a request for update card');
            console.log(e);
        }
    }

    async deleteTag(sessionToken, tag) {
        this.tags.delete(tag);
        const cardToUpdate = this.stringifyCard();

        try {
            await ky.patch('/cards/' + this.id,{
                headers: {
                    Authorization: sessionToken,
                    'content-type': 'application/json'
                }, 
                body: JSON.stringify(cardToUpdate)
            });
  
        } catch(e) {
            console.log('Error occurred while executing a request for update card ' + e);
        }
    }
}
