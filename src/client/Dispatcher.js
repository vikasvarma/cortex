/**
 * 
 */
export default class ServerDispatcher {

    serialize(query){
        var str = [];
        for (var prop in query)
          if (query.hasOwnProperty(prop)) {
            str.push(
                encodeURIComponent(prop) + "=" + encodeURIComponent(query[prop])
            );
          }
        return str.join("&");
    }

    /**
     * 
     * @param {*} url 
     * @param {*} query 
     * @returns 
     */
    async get(url, query){
        var URL = 'http://localhost:5000/' + url;
        if (Object.keys(query).length > 0){
            URL = URL + "?" + this.serialize(query);
        }
        
        try{
            const response = await fetch(URL, {
                method: 'GET',
                mode: 'cors'
            });
    
            var data = response.json();
            return data;

        } catch(err) {
            throw(err)
        }
    }

    /**
     * Send data to the backend server and retrieve a javascript object array.
     * @param {*} url 
     * @param {*} json 
     */
    async send(method, url, json) {
        try{
            url = 'http://localhost:5000/' + url;
            const response = await fetch(url, {
                method: method,
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(json)
            });
    
            var data = response.json();
            return data;

        } catch(err) {
            throw(err)
        }
    }
}