import axios from 'axios';

export default class Api {
    constructor(host) {
        this.host = host + "/api/v1";
    }

    getHeaders(token) {
        return {"Authorization": token};
    }

    getTables(token) {
        return axios.get(this.host + "/table", {headers: this.getHeaders(token)})
            .then(response => response.data.body);
    }

    getDependents(token, tableId) {
        return axios.get(this.host + "/table/" + tableId + "/dependents", {headers: this.getHeaders(token)})
            .then(response => response.data.body);
    }

    getDependencies(token, queryId) {
        return axios.get(this.host + "/query/" + queryId + "/dependencies", {headers: this.getHeaders(token)})
            .then(response => response.data.body);
    }
}