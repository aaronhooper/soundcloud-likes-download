import Papa from 'papaparse';

export function createCSV(json) {
    const headers = ['username', 'title', 'url'];

    let values = json.map(like => [
        like.user.username,
        like.title,
        like.permalink_url
    ]);

    values.unshift(headers);
    const options = {};
    return Papa.unparse(values, options);
}
