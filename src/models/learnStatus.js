import ky from 'ky';

export default class LearnStatus {
    constructor(id, cardId, folderName, exercises, repeat) {
        this.id = id;
        this.cardId = cardId;
        this.folderName = folderName;
        this.exercises = exercises;
        this.repeat = repeat;
    }

    toString() {
        return {
            id: this.id,
            cardId: this.cardId,
            folderName: this.folderName,
            exercises: this.exercises,
            repeat: this.repeat
        };
    }
  
    async updateStatus(sessionToken) {
        try {
            await ky.patch('/cards/learn-statuses/' + this.id, {
                headers: {
                    Authorization: sessionToken,
                    'content-type': 'application/json'
                }, 
                body: JSON.stringify(this.toString())
            });
  
        } catch(e) {
            console.log('Error occurred while executing a request for update learn status');
            console.log(e);
        }
    }
    
}
