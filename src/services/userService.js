import ky from 'ky';
import { url } from '../App';

export const userService = {
    async createUser(data) {
        const result = {
            ok: true,
            payload: ''
        };
        try {
            await ky.post(url + '/users', {
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(data),
                mode: 'cors'
            }).json();

            result.payload = 'Created successful!';
            console.log(result.payload);

            return result;
        } catch(e) {
            console.log('Error while creating new user ' + e);
            console.log(e);

            if (e.response.status === 403) {
                result.ok = false;
                result.payload = 'Email is already exist! Please, try again';

                return result; 
            } else {
                result.ok = false;
                result.payload = 'Server error. Please try again later';

                return result; 
            }
        }
    },
  
  
    // TODO
    // FIXME
    // XXX
    // NOTE
  
    /* one string */
  
    async loginUser(data) {
        const result = {
            ok: true,
        };

        try {
            const dataLogin = {
                email: data.email,
                password: data.password
            }

            const response = await ky.post(url + '/user-sessions', {
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(dataLogin),
                    mode: 'cors'
                }).json();

            result.payload = response.sessionToken;
            localStorage.setItem('sessionToken', result.payload);

            return result;
        } catch(e) {
            console.log('Error while sending data login ' + e);
        
            if (e.response.status === 403) {
                result.ok = false;
                result.errorMessage = 'Wrong email or password';

                return result; 
            } else {
                result.ok = false;
                result.errorMessage = 'Server error. Please try again later';
                
                return result; 
            }
        }
    },

    async logoutUser() {
        const sessionToken = localStorage.getItem('sessionToken');
        try {
            await ky.delete(url + '/user-sessions', {
                headers: {
                    Authorization: sessionToken,
                    'content-type': 'application/json',
                },
                mode: 'cors'
            }).json();
        } catch(e) {
            console.log('Error while sending logout data ' + e);
        }
    },
    async getDataUser() {
        const sessionToken = localStorage.getItem('sessionToken');
        const result = {
            ok: true,
        };

        try {
            const response = await ky.get(url + '/users/me', {
                headers: {
                    Authorization: sessionToken,
                    'content-type': 'application/json',
                },
                mode: 'cors'
            }).json();

            result.payload = response;

            return result;
            
            } catch(e) {
                console.log('Error while request profile of user ' + e);
                result.ok = false;
                result.errorMessage = 'Server error. Please try again later';

                return result; 
            }
        }
}
