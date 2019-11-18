const fs = require('fs');
const unfriendlyWordsHere = require('./lib/non_friendly');
let result;
// const contents = fs.readFileSync('./lib/non_friendly.json');
// const jsonContent = JSON.parse(contents);

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
	app.log('Yay, the app was loaded!');

	app.on('pull_request', async context => {
		// we are calling on the GITHUB API issue context
		// this will allow us to access methods from the
		// issue context of the GITHUB API
		// we are getting a comment payload ready that we will use
		// to post a comment later

		// const isUnfriendlyComment = context.issue({
		// 	body: `This PR contains some non inclusive or unfriendly terms. These terms include ${result}`,
		// });

		// we are listening to the stream and allowing to post by
		// the owner of the bot in this case and we are looking
		// up the name of the repo along with the number, which
		// should be the issue number think but need to
		// confirm

		const owner = context.payload.repository.owner.login;
		const repo = context.payload.repository.name;
		const number = context.payload.number;

		// below we are now looking at the pull request context which
		// is async so we need to await the result and we have deconstructed
		// the listFiles method to get the ownser, the repo and in this context
		// the pull request number
		const files = await context.github.pullRequests.listFiles({
			owner,
			repo,
			number,
		});
		console.log('start of try two', files, 'give us a payload try two');
		// We are talking the data that comes back in a response to the
		// asynchronous call. We then patch and split it in a string
		// per line

		const checkCommit = files.data[0].patch.split('\n');
		const sampleCommit = [
			'+this is a sentence with the words blacklist and just in it',
		];

		// Here we are mapping through every word we find in the string
		// and returning a new global search, upper or lowercase first
		// letter, of the words that are in our unfriendlywords array
		// this unfriendly words array is one that can be added to
		// and updated so any word that we research and find out to be
		// unfriendly can be added

		const myExpressions = unfriendlyWordsHere.map(word => {
			return new RegExp(word, 'ig');
		});

		console.log(myExpressions, 'what do we get here');
		const test = checkCommit[0].match(myExpressions[0]);
		console.log(test, 'what happens here now');

		// Here we are filtering the commit that we find with checkCommit
		// which should be a array of strings and we are filtering out
		// anything that does not contain a plus as the first character,
		// as the plus indicates what has been added via a PR or Pull request
		// then we use some, and a for each to go through the mapping of each word
		// against each unfriendly word.
		// if we happen to find one of those words in the filtered array of words
		// we will respond with true. The conditional will run when the value is
		// truthy, and if falsy will automatically skip the if and return false

		// const checkerFinal = checkCommit
		// 	.filter(line => line[0] === '+')
		// 	.some(line => {
		// 		for (const expression of myExpressions) {
		// 			if (expression.test(line)) {
		// 				return true;
		// 			}
		// 		}
		// 		return false;
		// 	});

		const checkerFinal = checkCommit
			.filter(line => line[0] === '+')
			.some(line => {
				for (const expression of myExpressions) {
					console.log(line, ' the line ');
					console.log(expression, 'the expression');
					console.log(line.match(expression), 'the matching');
					let result = line.match(expression);
					if (expression.test(line)) {
						let result = line.match(expression);
						console.log(
							result,
							'********* the result within the block *********',
						);
						return result;
					}
				}
				return false;
			});
		console.log(result, '******* outside the block *******');
		const isUnfriendlyComment = context.issue({
			body: `This PR contains some non inclusive or unfriendly terms. These terms include ${result}`,
		});
		const myMatches = checkCommit.map(word => {
			const regex = /word, ig/;
			return word.match(regex);
		});
		console.log(myMatches, '*********** myMatches');

		// const checkerReport = checkCommit.match(line => {
		// 	for (const match of myMatches) {
		// 		if (match(line)) {
		// 			return true;
		// 		}
		// 	}
		// 	return false;
		// });

		console.log(checkerFinal, '*********** checkerFinal');

		// we now want to take that truthy value (an unfriendly word was found)
		// through another truthy check, and if truthy the conditional will run
		// and use the context for issues and the createComment method
		// it create it with the payload or body of the string we give it in this
		// case the message that the PR contains some unfriendly words

		if (checkerFinal) {
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
