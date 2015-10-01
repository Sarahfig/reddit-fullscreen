import Ember from 'ember';

export default Ember.Service.extend({
	functions: {
		nextPost: {
			default: 'Right Arrow',
			description: 'Move to next post',
			user: localStorage.keyNextPost ? localStorage.keyNextPost : 'default'
		},
		previousPost: {
			default: 'Left Arrow',
			description: 'Move to previous post',
			user: localStorage.keyPreviousPost ? localStorage.keyPreviousPost : 'default'
		},
		upVote: {
			default: 'Up Arrow',
			description: 'Upvote currently viewed post',
			user: localStorage.keyUpVote ? localStorage.keyUpVote : 'default'
		},
		downVote: {
			default: 'Down Arrow',
			description: 'Downvote currently viewed post',
			user: localStorage.keyDownVote ? localStorage.keyDownVote : 'default'
		}
	},
	keyMap: [
		{
			name: 'A',
			value: 97
		},
		{
			name: 'B',
			value: 98
		},
		{
			name: 'C',
			value: 99
		},
		{
			name: 'D',
			value: 100
		},
		{
			name: 'E',
			value: 101
		},
		{
			name: 'F',
			value: 102
		},
		{
			name: 'G',
			value: 103
		},
		{
			name: 'H',
			value: 104
		},
		{
			name: 'I',
			value: 105
		},
		{
			name: 'J',
			value: 106
		},
		{
			name: 'K',
			value: 107
		},
		{
			name: 'L',
			value: 108
		},
		{
			name: 'M',
			value: 109
		},
		{
			name: 'N',
			value: 110
		},
		{
			name: 'O',
			value: 111
		},
		{
			name: 'P',
			value: 112
		},
		{
			name: 'Q',
			value: 113
		},
		{
			name: 'R',
			value: 114
		},
		{
			name: 'S',
			value: 115
		},
		{
			name: 'T',
			value: 116
		},
		{
			name: 'U',
			value: 117
		},
		{
			name: 'V',
			value: 118
		},
		{
			name: 'W',
			value: 119
		},
		{
			name: 'X',
			value: 120
		},
		{
			name: 'Y',
			value: 121
		},
		{
			name: 'Z',
			value: 122
		},
		{
			name: 'Enter',
			value: 13
		},
		{
			name: 'Shift',
			value: 16
		},
		{
			name: 'Control',
			value: 17
		},
		{
			name: 'Alt',
			value: 18
		},
		{
			name: 'Escape',
			value: 27
		},
		{
			name: 'Page Up',
			value: 33
		},
		{
			name: 'Page Down',
			value: 34
		},
		{
			name: 'End',
			value: 35
		},
		{
			name: 'Home',
			value: 36
		},
		{
			name: 'Left Arrow',
			value: 37
		},
		{
			name: 'Up Arrow',
			value: 38
		},
		{
			name: 'Right Arrow',
			value: 39
		},
		{
			name: 'Down Arrow',
			value: 40
		},
		{
			name: 'Insert',
			value: 45
		},
		{
			name: 'Delete',
			value: 46
		},
		{
			name: '0',
			value: 48
		},
		{
			name: '1',
			value: 49
		},
		{
			name: '2',
			value: 50
		},
		{
			name: '3',
			value: 51
		},
		{
			name: '4',
			value: 52
		},
		{
			name: '5',
			value: 53
		},
		{
			name: '6',
			value: 54
		},
		{
			name: '7',
			value: 55
		},
		{
			name: '8',
			value: 56
		},
		{
			name: '9',
			value: 57
		},
	]
});
