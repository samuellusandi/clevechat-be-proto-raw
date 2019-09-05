export function generateToken(): string {
    const availableCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 32;
    let token = '';
    for (let i = 0; i < length; ++i) {
        token += availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    }
    return token;
}
