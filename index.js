const badWords = require('./lib/non_friendly');
const { logger } = require('probot/lib/logger');

// /**
//  * This is the main entrypoint to your Probot app
//  * @param {import('probot').Application} app
//  */

// module.exports = app => {
// 	app.on(`pull_request`, async context => {
// 		context.log({
// 			event: context.event,
// 			action: context.payload.action,
// 			random: 'bum it',
// 		});
// 		console.log('we are getting a step further');
// 	});
// };
module.exports = app => {
	app.log('APP LOADED');
	console.log('APP LOADED CONSOLE LOG');
	app.on('pull_request', async context => {
		console.log('PULL REQUEST STARTED');
		const owner = context.payload.repository.owner.login;
		console.log(owner, 'PR  - OPENED BY');
		const repo = context.payload.repository.name;
		console.log(repo, 'PR - REPO NAME');
		const number = context.payload.number;
		let myLogger = logger.child({ pr: context.payload.pull_request.number });
		const files = await context.github.pullRequests.listFiles({
			owner,
			repo,
			number,
		});
		const checkCommit = files.data[0].patch.split('\n');
		const onlyAddedLines = line => {
			return line.startsWith('+');
		};
		const removeFirstPlus = line => {
			return line.substring(1);
		};
		const extractBadWords = (ExtractedBadWordsArray, line) => {
			for (const badWord of badWords) {
				if (line.includes(badWord)) {
					ExtractedBadWordsArray.push({
						word: badWord,
						line: line,
						index: line.indexOf(badWord),
						status: true,
						count: ExtractedBadWordsArray.length,
					});
				}
			}
			return ExtractedBadWordsArray;
		};

		const result = checkCommit
			.filter(onlyAddedLines)
			.map(removeFirstPlus)
			.reduce(extractBadWords, []);

		const wordsFound = result.map(function(el) {
			return el.word;
		});

		const linesFound = result.map(function(el) {
			return el.line;
		});

		const isUnfriendlyComment = context.issue({
			body: `💔 This PR contains some non inclusive or unfriendly terms.
			The following words were found: ${wordsFound}
			These words were found on the following lines: ${linesFound}`,
		});

		if (result[0].status) {
			context.github.issues.createComment(isUnfriendlyComment);
			console.log('ISSUE POSTED');
			myLogger.info({
				event: EVENT,
				action: `ISSUE_POSTED`,
				pr,
			});
		}
	});
};
