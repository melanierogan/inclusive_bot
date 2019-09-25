const unfriendlyWords = [
	'+whitelist',
  '+blacklist',
  'blacklist',
	'+simply',
	'+master',
	'+slave',
	'+just',
	'+guys',
];

module.exports = unfriendlyWords;
//there are some holes in this logic as having a plus first would suggest that the start
//of the line contains the added word, but the word may be in the middle of a 
//sentence
