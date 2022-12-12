import $ from 'jquery';

const getToken = (username,password) => {
    return $.ajax({
        url: 'http://127.0.0.1:8001/users/',
        method: 'POST',
        headers: {
            Authorization: 'Basic ${btoa( ${username}:${password}}',
        },
    }).then(response => response.token);
};

export default getToken;
