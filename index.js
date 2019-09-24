/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
	app.log('Yay, the app was loaded!');

	app.on('pull_request', async context => {
		const issueComment = context.issue({
			body: 'No bums, thank you!',
		});

		const isBumcomment = context.issue({
			body: 'This PR contains a bum',
		});
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
		const compare = await context.github.repos.compareCommits(
			context.repo({ base: pr.base.sha, head: pr.head.sha }),
		);
		const files = await context.github.pullRequests.listFiles({
			owner,
			repo,
			number,
		});
		const checkCommit = files.data[0].patch.split('\n');
		const fullcheck = checkCommit.some(function(x) {
			return x === '+bum';
		});
		console.log(fullcheck, 'checking the test for the word with some');
		console.log(checkCommit.includes('bum'), 'checking the test for the word');
		if (fullcheck) {
			context.github.issues.createComment(isBumcomment);
		}
	});
};
