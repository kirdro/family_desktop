export const getHeaders = (token: string = '', appKey: string = 'maps/client') => {
    return {
        'token': token,
        'x-app-key ': appKey,
        'Content-type': 'application/json',
    };
};
