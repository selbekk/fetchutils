class FetchError extends Error {
    constructor(message, status, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

const isError = response => response.status >= 400;

const textOrJson = (response) => {
    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('json')) {
        return response.json()
            .catch((e) => {
                throw new FetchError(
                    `Error while parsing JSON: ${e}`,
                    response.status,
                    response,
                );
            });
    }
    return response.text();
};

const parse = (response) => {
    if (response.status === 204) {
        return null;
    }
    if (isError(response)) {
        return textOrJson(response)
            .then((error) => {
                throw new FetchError(
                    response.statusText,
                    response.status,
                    error,
                );
            });
    }
    return textOrJson(response);
};

const getHeaders = (verb) => {
    const headers = {
        Accept: 'application/json,text/plain',
    };

    if (verb !== 'GET') {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
};

const withGetParameters = (url, params = {}) => {
    if (Object.keys(params).length === 0) {
        return url;
    }
    const paramString = Object.keys(params)
        .filter(key => ![null, undefined, NaN].includes(params[key]))
        .map(key => `${key}=${params[key]}`)
        .join('&');

    return `${url}?${paramString}`;
};

const doRequest = verb => parser => (url, data = {}, overrides = {}) => {
    const defaults = {
        method: verb,
        credentials: 'same-origin',
        body: verb !== 'GET' ? JSON.stringify(data) : undefined,
    };

    const config = {
        ...defaults,
        ...overrides,
        headers: new Headers({
            ...getHeaders(verb),
            ...overrides.headers,
        }),
    };

    return fetch(url, config)
        .then(parser);
};

export function get(url, data, overrides) {
    return doRequest('GET')(parse)(withGetParameters(url, data, overrides), {}, overrides);
}

export function post(url, data, overrides) {
    return doRequest('POST')(parse)(url, data, overrides);
}

export function put(url, data, overrides) {
    return doRequest('PUT')(parse)(url, data, overrides);
}

export function del(url, data, overrides) {
    return doRequest('DELETE')(parse)(url, data, overrides);
}
