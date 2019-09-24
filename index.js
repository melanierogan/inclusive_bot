/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
	// Your code here
	app.log('Yay, the app was loaded!');

	app.on('pull_request', async context => {
		const issueComment = context.issue({
			body: 'No bums, thank you!',
		});

		const isBumcomment = context.issue({
			body: 'This PR contains a bum',
		});
		// const params = context.pullRequest({
		// 	body: 'Thanks for opening a PR!',
		// });
		// console.log(issueComment, '******* issue COmment');
		// console.log(context.github.issues.createComment(issueComment), '************ create *******')
		// return context.github.pull_request.createComment(issueComment);
		const owner = context.payload.repository.owner.login;
		const repo = context.payload.repository.name;
		const number = context.payload.number;
		const pr = context.payload.pull_request;
		const path = 'README.md';
		const test = await context.github.repos.getContents({
			owner,
			repo,
			number,
			path,
		});

		const contentTest = Buffer.from(test.data.content, 'base64').toString();
		console.log(contentTest, 'test the contents');
		// console.log(test, 'the contents of the files');
		const compare = await context.github.repos.compareCommits(
			context.repo({ base: pr.base.sha, head: pr.head.sha }),
		);
		console.log(compare, 'compare there');
		const files = await context.github.pullRequests.listFiles({
			owner,
			repo,
			number,
		});
		console.log(
			files.data[0].patch.split('\n'),
			'************************* what is this *************************',
		);
		const checkCommit = files.data[0].patch.split('\n');
		// console.log(
		//   	Object.getOwnPropertyNames(files.data),
		//   	'hopefully what i can do with files',
		//   );
		// const commitTest = Buffer.from(files.data.content, 'base64').toString();
		// console.log(commitTest, 'can I get file contents from the commit');
		// console.log(files, 'can i get the files');
		// console.log(context.repo, 'the context in the compare');
		// const lines = files.patch.split('\n');
		// console.log(lines, 'lines here ');
		// if (line.startsWith('+') && line.includes('bum')) {
		// 	context.github.issues.createComment(issueComment);
		// }

		// const isBum = files.data.commits.every(data => {
		// 	// console.log(
		// 	// 	data.commit,
		// 	// 	'************* what do we get here? ***************',
		// 	// );
		// 	return data.commit.message.match(/bum/i);
		// });

		// console.log(context.payload.pull_request, 'do i get info from payload');
		// console.log(
		// 	Object.getOwnPropertyNames(context.github.repos.compareCommits),
		// 	'hopefully properties',
		// );
		// console.log(context.github.pullRequests.getCommits, 'what info do we get');
		// if (isBum === true) {
		// 	context.github.issues.createComment(isBumcomment);
		// } else {
		// 	context.github.issues.createComment(issueComment);
		// }
		const fullcheck = checkCommit.some(function(x) {
			return x === '+bum';
		});
		console.log(fullcheck, 'checking the test for the word with some');
		console.log(checkCommit.includes('bum'), 'checking the test for the word');
		if (fullcheck) {
			context.github.issues.createComment(isBumcomment);
		}

		// return context.github.issues.createComment(issueComment);
		// context.log('a pull request was opened');
	});
};
