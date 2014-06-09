(function($, w) {
	'use strict';

	var AudioComponent = function () {

		return {
			context : null,
			notes: null,
			sounds : [],
			configNotesUrl: '/piano-live/notes.json',
			notesLoaded: false,
			octave: '0',
			enumNotes : {
				'a' : 'la',
				'b' : 'si',
				'c' : 'do',
				'd' : 're',
				'e' : 'mi',
				'f' : 'sol',
				'g' : 'la'
			},

			getUrl : function (id) {
				if (id)
					return '/piano-live/audio/'+ id +'.wav.mp3';
				else 
					return false;
			},

			getSound : function (id, delayTime) {
				var self = this,
					request = new XMLHttpRequest(),
					urlRequest = self.getUrl(id),
					bufferAudio = null,
					context = self.context;

				request.open('GET', urlRequest, true);
				request.responseType = 'arraybuffer';

				request.onload = function() {
					context.decodeAudioData(request.response, function(buffer) {
						var sound = {
							id : id,
							buffer : buffer
						};

						self.sounds.push(sound);
						self.playSound(buffer);

					});
				}

				request.send();

			}, 

			init: function() {
				try {

					w.AudioContext = w.AudioContext || w.webkitAudioContext;
					this.context = new AudioContext();
				
				 }

				 catch(e) {

				 	console.log('Web Audio API is not supported in this browser', e);

				 }

			},

			playSound: function (buffer) {
				var self = this,
					source = self.context.createBufferSource();

				source.buffer = buffer;
				source.connect(self.context.destination);
				source.start(0);
			},

			loadSound: function(id) {
				var self = this,
					isCachedSound = PianoUtils.findByProperty('id', id, this.sounds);

				if (isCachedSound) {
					var buffer = PianoUtils.getObjByProperty('id',id, self.sounds).buffer;
					self.playSound(buffer);
				} else {
					self.getSound(id);
				}
			},

			loadConfigNotes: function () {
				var self = this;

				self.notes = {};
				$.getJSON(self.configNotesUrl, function(data) {
					self.notesLoaded = true;
					self.notes = data.notes;
				});
			},

			decodeSound: function (textToDecode) {
				var self = this,
					text = textToDecode.toLowerCase(),
					splitedText = text.split(''),
					splitedTextLength = splitedText.length;

				if (splitedTextLength > 0) {

					for (var i=0; i < splitedTextLength; i++) {

						if (!self.notesLoaded) {
							self.loadConfigNotes();
						} 

						var note = '',
							letter = splitedText[i];

						note = self.getNoteByLetter(letter);

						if ( note ) {
							var sound = self.notes[self.octave][note];
							console.log(note, sound);
							self.loadSound(sound);
							PianoUtils.sleep(500);
						}
					}

				} else {

					throw "Texto inválido!"

				}

			},

			getNoteByLetter : function (letter) {
				var self = this;
				if ( self.enumNotes[letter] )
					return self.enumNotes[letter]
				else
					return undefined;
			}
		}
	}

	w.audioComponent = new AudioComponent();
	w.audioComponent.init();
	w.audioComponent.loadConfigNotes();
	
})(jQuery, window, undefined)