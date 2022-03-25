export class UrlHelper {
    private parsedQueryParams: object;
    private history;

    constructor(history) {
        this.parsedQueryParams = UrlHelper.parseQueryParams();
        this.history = history;
    }

    public static getScrambleApiDomain() {
        return 'https://3kshxn7a1g.execute-api.us-east-1.amazonaws.com/prod/';
    }

    public static getSolveSessionApiDomain() {
        return 'https://ehje0sjzf7.execute-api.us-east-1.amazonaws.com/prod/';
    }

    public static getSessionManagementUrl() {
        const domain = window.location.hostname;
        return `${domain}/sessions`;
    }

    public static parseQueryParams() {
        const queryString = window.location.search;
        const queryStringWithQuestionRemoved = queryString.slice(1, queryString.length);
        const keyValuePairs = queryStringWithQuestionRemoved.split('&')
            .map(keyValuePair => {
                const keyThenValue = keyValuePair.split('=');
                return {[keyThenValue[0]]: keyThenValue[1]};
            });
        return keyValuePairs.reduce(((previousValue, currentValue) => ({
            ...previousValue,
            ...currentValue
        })));
    }

    private redirectWithQueryParams(path, queryParamMap) {
        const queryParamString = Object.keys(queryParamMap)
            .map(queryParam => `${queryParam}=${queryParamMap[queryParam]}`)
            .join('&');
        this.redirect(`${path}?${queryParamString}`);
    }

    private redirect(path) {
        this.history.push(path);
    }
}