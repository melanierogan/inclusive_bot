const fs = require('fs');
const badWords = require('./lib/non_friendly');
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
	app.log('Yay, the app was loaded!');
	app.on('pull_request', async context => {
		const owner = context.payload.repository.owner.login;
		const repo = context.payload.repository.name;
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
		const sampleCommit = [
			'+this is a sentence with the words blacklist and just in it',
		];
		const issueContent = JSON.stringify(result);
		for (const results in result) {
			console.log('this many', results);
		}

		// Hoe do i best handle that this will only ever give me the first element in the array
		// in handlebars I would use each but here I need to use a for loop
		const isUnfriendlyComment = context.issue({
			body: `💔 This PR contains some non inclusive or unfriendly terms.\n
			These terms include :\n ${result[0].word}. Then try ${issueContent}`,
		});

		if (result[0].status) {
			context.github.issues.createComment(isUnfriendlyComment);
		}
	});
};

// TO DO:

// ONE: to do next, use the match() method which retrieves the result of a
// matching string against a regular expression. This will return
// aim to return an array of unfriendly words that have been used
// in the PR

// TWO: Make the testing a little more streamlined. So you don't have
// to post an issue to see the whole thing working
// perhaps have a script that mimicks how the handler for
// probot works and in the end on truth values it posts
// a payload via a console log

// THREE: look into how i can use regex for the words like
// blacklist vs black-list vs black
