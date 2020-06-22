import ky from 'ky';
import LearnStatus from '../models/learnStatus.js';
import { url } from '../App';

export default class LearnStatusService {
    static populateStatuses(allStatuses) {
        const statusesInFolders = {};
        for (let entry of allStatuses) {
            if (! Object.keys(statusesInFolders).includes(entry.folderName)) {
                statusesInFolders[entry.folderName] = [];
                statusesInFolders[entry.folderName].push(entry);
            } else {
                statusesInFolders[entry.folderName].push(entry);
            }
        }

        return statusesInFolders;
    }
    
    static populateStatus(status, statusesInFolders) {
        if (! Object.keys(statusesInFolders).includes(status.folderName)) {
            statusesInFolders[status.folderName] = [];
            statusesInFolders[status.folderName].push(status);
        } else {
            statusesInFolders[status.folderName].push(status);
        }

        return statusesInFolders;
    }

    static async createLearnStatus(cardId, folderName) {
        const sessionToken = localStorage.getItem('sessionToken');

        const statusData = {
            cardId,
            folderName,
            exercises: {
                writeTranslation: false,
                writeWord: false,
                selectTranslation: false,
                selectWord: false
            },
            repeat: {
                
            }
        };

        const response = await ky.post(url + '/cards/learn-statuses', {
            headers: {
                Authorization: sessionToken,
                'content-type': 'application/json'
            },
            body: JSON.stringify(statusData)
        }).json();

        return new LearnStatus (
            response, 
            statusData.cardId, 
            statusData.folderName,
            statusData.exercises,
            statusData.repeat
        );
    }

    static findOneLearnStatus(statuses, cardId) {
        return statuses.find(item => item.cardId === cardId);
    }

    static async deleteLearnStatus(id) {
        const sessionToken = localStorage.getItem('sessionToken');

        try {
            await ky.delete(url + '/cards/learn-statuses/' + id, {
                headers: {
                    Authorization: sessionToken,
                    'content-type': 'application/json'
                }
            });

        } catch (e) {
            console.error('an error occurred while executing a delete status' + e);
        }

    }

    static async getLearnStatusesFromServer() {
        const sessionToken = localStorage.getItem('sessionToken');

        try {
            const data = await ky.get(url + '/cards/learn-statuses', {
                headers: {
                    Authorization: sessionToken,
                    'content-type': 'application/json'
                }
            }).json();

            if (! data.length) {
                return data;
            }

            return data.map(item => new LearnStatus (
                item.id, 
                item.cardId, 
                item.folderName,
                item.exercises,
                item.repeat
            ));

        } catch (e) {
            console.log('an error occurred while executing a request for receiving all learn statuses ' + e);
        }
    }

}
