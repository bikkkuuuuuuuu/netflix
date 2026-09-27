const randomStringGenerator = (len = 10, str = true) => {
    let characters = '0123456789'
    if (str) {
        characters += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    }
    let length = characters.length
    let random = ''
    for (let i = 1; i <= len; i++) {
        let position = Math.ceil(Math.random() * length - 1)
        random += characters[position]
    }
    return random
}

module.exports = {
    randomStringGenerator
}