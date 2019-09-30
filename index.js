const fs = require('fs');
const unfriendlyWordsHere = require('./lib/non_friendly');
// const contents = fs.readFileSync('./lib/non_friendly.json');
// const jsonContent = JSON.parse(contents);

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
	app.log('Yay, the app was loaded!');

	app.on('pull_request', async context => {
		const isUnfriendlyComment = context.issue({
			body: 'This PR contains some non inclusive or unfriendly terms',
		});
		const owner = context.payload.repository.owner.login;
		const repo = context.payload.repository.name;
		const number = context.payload.number;
		const files = await context.github.pullRequests.listFiles({
			owner,
			repo,
			number,
		});
		const checkCommit = files.data[0].patch.split('\n');
		const sampleCommit = [
			'+this is a sentence with the words blacklist and just in it',
		];
		const myExpressions = unfriendlyWordsHere.map(word => {
			return new RegExp(word, 'ig');
		});
		const checkerFinal = checkCommit
			.filter(line => line[0] === '+')
			.some(line => {
				for (const expression of myExpressions) {
					if (expression.test(line)) {
						return true;
					}
				}
				return false;
			});
		console.log('what do i get here', expression);
		if (checkerFinal) {
			context.github.issues.createComment(isUnfriendlyComment);
		}
	});
};
