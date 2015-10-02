import Ember from 'ember';
var KeyFunction = function(data) {
	Ember.$.extend(this, data);
	this.user = function() {
		return localStorage[data.name] ? localStorage[data.name] : 'default';
	};
	return this;
};
KeyFunction.prototype.getKey = function() {
	if(this.user() === 'default') {
		return this.default;
	}
	return this.user();
};
export default Ember.Service.extend({
	functions: {
		nextPost: new KeyFunction({
			default: 'D',
			description: 'Move to next post',
			name: 'keyNextPost'
		}),
		previousPost: new KeyFunction({
			default: 'A',
			description: 'Move to previous post',
			name: 'keyPreviousPost'
		}),
		upVote: new KeyFunction({
			default: 'W',
			description: 'Upvote currently viewed post',
			name: 'keyUpvote'
		}),
		downVote: new KeyFunction({
			default: 'S',
			description: 'Downvote currently viewed post',
			name: 'keyDownVote'
		})
	},
	keyMap: {
		97: 'A',
		98: 'B',
		99: 'C',
		100: 'D',
		101: 'E',
		102: 'F',
		103: 'G',
		104: 'H',
		105: 'I',
		106: 'J',
		107: 'K',
		108: 'L',
		109: 'M',
		110: 'N',
		111: 'O',
		112: 'P',
		113: 'Q',
		114: 'R',
		115: 'S',
		116: 'T',
		117: 'U',
		118: 'V',
		119: 'W',
		120: 'X',
		121: 'Y',
		122: 'Z',
		13: 'Enter',
		16: 'Shift',
		17: 'Control',
		18: 'Alt',
		27: 'Escape',
		33: 'Page Up',
		34: 'Page Down',
		35: 'End',
		36: 'Home',
		37: 'Left Arrow',
		38: 'Up Arrow',
		39: 'Right Arrow',
		40: 'Down Arrow',
		45: 'Insert',
		46: 'Delete',
		48: '0',
		49: '1',
		50: '2',
		51: '3',
		52: '4',
		53: '5',
		54: '6',
		55: '7',
		56: '8',
		57: '9',
	}
});
