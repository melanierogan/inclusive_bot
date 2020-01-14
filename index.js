const badWords = require('./lib/non_friendly');
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
	app.log('Yay, the app was loaded!');
	app.on('pull_request', async context => {
		console.log('a pull request started');
		const owner = context.payload.repository.owner.login;
		console.log(owner, 'who owns the 	PR');
		const repo = context.payload.repository.name;
		console.log(repo, 'the repo name');
		const number = context.payload.number;
		// older below
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
				// to make case sensitive, lowercase the line that comes in
				// remember badwords list to all be lowercase
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
			The following words were found: *${wordsFound}*\n
			These words were found on the following lines:\n *{linesFound}* `,
		});

		if (result[0].status) {
			context.github.issues.createComment(isUnfriendlyComment);
		}
	});
};

