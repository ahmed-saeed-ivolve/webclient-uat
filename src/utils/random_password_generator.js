const key_strings = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    number: '0123456789',
    symbol: '*@#$?!|',
};

const generateRandomPassword = (lower, upper, num, sym, length) => {
    let MAIN_STRING = '';
    let PASSWORD = '';

    const options = {
        lowercase: lower,
        uppercase: upper,
        number: num,
        symbol: sym,
    };

    for (let i = 0; i < Object.keys(options).length; i++) {
        MAIN_STRING += Object.values(options)[i]
            ? key_strings[Object.keys(options)[i]]
            : '';
    }

    if (MAIN_STRING != '' && length > 0) {
        for (let i = 0; i < length; i++) {
            PASSWORD +=
                MAIN_STRING[Math.floor(Math.random() * MAIN_STRING.length)];
        }

        return PASSWORD;
    }
};

export { generateRandomPassword };
