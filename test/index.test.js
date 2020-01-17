const nock = require('nock');
// Requiring our app implementation
const myProbotApp = require('..');
const { Probot } = require('probot');
const payload = require('./fixtures/issues.opened');
const prCreatedBody = { body: 'Thanks for opening this issue!' };

nock.disableNetConnect();

describe('inclusivebot app', () => {
	let probot;

	beforeEach(() => {
		probot = new Probot({});
		// Load our app into probot
		const app = probot.load(myProbotApp);

		// just return a test token
		app.app = () => 'test';
	});

	test('creates a comment when a PR is opened', async () => {
		nock('https://api.github.com')
			.post('/app/installations/2/access_tokens')
			.reply(200, { token: 'test' });

		nock('https://api.github.com')
			.post('/repos/hiimbex/testing-things/pulls/57', body => {
				expect(body).toMatchObject(prCreatedBody);
				return true;
			})
			.reply(200);

		// Receive a webhook event
		await probot.receive({ name: 'issues', payload });
	});

	// to do, specific unit test for when unfriendly words occur
});
