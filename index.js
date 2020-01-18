const badWords = require('./lib/non_friendly');
const { logger } = require('probot/lib/logger');

module.exports = app => {
	app.log('APP LOADED');
	logger.info({
		action: 'APP_LOADED',
	});
	app.on('pull_request', async context => {
		console.log(
			context.payload.pull_request.body,
			'****** what the hell is going on ******',
		);
		let pr;
		let myLogger = logger.child({
			pr: context.payload.pull_request.pull_number,
		});
		myLogger.info({
			action: 'PULL_REQUEST_NUMBER',
		});
		const owner = context.payload.repository.owner.login;
		myLogger.info({
			action: 'PULL_REQUEST_OWNER',
			pr: context.payload.repository.owner.login,
		});
		const repo = context.payload.repository.name;
		myLogger.info({
			action: 'PULL_REQUEST_REPOSITORY',
			pr: context.payload.repository.name,
		});
		const number = context.payload.pull_number;
		const files = await context.github.pullRequests.listFiles({
			owner,
			repo,
			number,
		});
		const checkCommit = context.payload.repository.body.patch.split('\n');
		// const checkCommit = files.data[0].patch.split('\n');
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
			myLogger.info({
				action: 'ISSUE_POSTED',
				pr,
			});
		}
	});
};
