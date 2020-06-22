export const validation = {
    stringifyData(data) {
        let stringifiedData = {};

        for (const entry of data) {
            stringifiedData[entry.name] = entry.value;
        }
        
        return stringifiedData;
    },

    isValidName(name) {
        if (! name ||
            ! name.length ||
            typeof name !== 'string' ||
            ! name.trim().length
        ) {
            return false;
        }
        
        return true;
    },

    isValidEmail(email) {
        if (! email || typeof email !== 'string') {
            return false;
        }
    
        if (! (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            return false;
        }
        
        return true;
    },

    isValidPassword(password) {
        if (! password || ! password.length) {
            return false;
        }
        
        return true;
    },

    isLongPassword(password, minLength = 6) {
        if (! password ||
            ! password.length ||
            password.length < minLength) {
            return false;
        }
        
        return true;
    },

    isPasswordContainsLowerCase(password) {
        if (! /[a-z]/.test(password)) {
            return false;
        }
        
        return true;
    },

    isPasswordContainsUpperCase(password) {
        if (! /[A-Z]/.test(password)) {
            return false;
        }
        
        return true;
    },

    isPasswordContainsNumbers(password) {
        if (! /[0-9]/.test(password)) {
            return false;
        }
        
        return true;
    },

    isValidValue(word) {
        if (! word || ! word.length || typeof word !== 'string') {
            return false;
        }
        
        return true;
    },

    validateFormCreateCard(data) {
        let result = {
            ok: true,
            errors: []
        };

        if (! this.isValidValue(data.word)) {
            result.errors.push({field: 'word', message: 'Word can\'t be empty'});
        }

        if (! this.isValidValue(data.translate)) {
            result.errors.push({field: 'translate', message: 'Translation can\'t be empty'});
        }

        if (result.errors.length) {
            result.ok = false;
        }
        
        return result;
    },
  
    validateFormUpdateCard(data) {
        let result = {
            ok: true,
            errors: []
        };

        if (! this.isValidValue(data.wordToLearn)) {
            result.errors.push({field: 'wordToLearn', message: 'Word can\'t be empty'});
        }

        if (! this.isValidValue(data.wordTranslate)) {
            result.errors.push({field: 'wordTranslate', message: 'Translation can\'t be empty'});
        }

        if (result.errors.length) {
            result.ok = false;
        }
        
        return result;
    },
  
    validateFormUserRegistration(rawData) {
        const data = this.stringifyData(rawData);

        let result = {
            ok: true,
            errors: []
        };

        if (! this.isValidName(data.name)) {
            result.errors.push({field: 'name', message: 'User name can\'t be empty'});
        }
        if (! this.isValidEmail(data.email)) {
            result.errors.push({field: 'password', message: 'Email can\'t be empty'});
        }

        if (! this.isValidPassword(data.password)) {
            result.errors.push({field: 'password', message: 'Password can\'t be empty'});
        }

        if (! this.isLongPassword(data.password)) {
            result.errors.push({
                field: 'password', 
                message: 'Password must contain at least six characters'
            });
        }

        if (! this.isPasswordContainsLowerCase(data.password)) {
            // eslint-disable-next-line max-len
            result.errors.push({
                field: 'password', 
                message: 'Password must contain at least one lowercase letter (a-z)'}
            );
        }

        if (! this.isPasswordContainsUpperCase(data.password)) {
            result.errors.push({
                field: 'password', 
                message: 'Password must contain at least one uppercase letter (A-Z)'}
            );
        }

        if (! this.isPasswordContainsNumbers(data.password)) {
            result.errors.push({
                field: 'password', 
                message: 'Password must contain at least one number (0-9)'}
            );
        }

        if (result.errors.length) {
            result.ok = false;
        }
        
        return result;
    },
  
    validateFormUserLogin(rawData) {
        const data = this.stringifyData(rawData);

        let result = {
            ok: true,
            errors: []
        };

        if (! this.isValidEmail(data.email)) {
            result.errors.push({field: 'password', message: 'Password can\'t be empty'});
        }

        if (! this.isValidPassword(data.password)) {
            result.errors.push({field: 'password', message: 'Password can\'t be empty'});
        }

        if (result.errors.length) {
            result.ok = false;
        }
        
        return result;
    },

    validateFormAdditionFolder(rawData) {
        const data = this.stringifyData(rawData);

        let result = {
            ok: true,
            errors: []
        };

        if (! this.isValidName(data.folderName)) {
            result.errors.push({field: 'name', message: 'This field can\'t be empty'});
        }

        if (result.errors.length) {
            result.ok = false;
        }
        
        return result;
    }
};
