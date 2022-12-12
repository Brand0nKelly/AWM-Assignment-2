export default class APISerive {
   

    static LoginUser(body){
        return fetch(`http://127.0.0.1:8001/api-token-auth/`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(body)
        }).then(resp => resp.json())
    }



    static RegisterUser(body){
        return fetch(`http://127.0.0.1:8001/api-token-auth/`, {
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(body)
        }).then(resp => resp.json())
    }    

    
    

}