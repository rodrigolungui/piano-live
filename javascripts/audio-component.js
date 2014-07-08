'use strict';

var AudioComponent = function () {

	return {
		context : null,
		oscillator : null,
		notes: null,
		analyser : null,
		sounds : [],
		configNotesUrl: '/notes.json',
		notesLoaded: false,
		octave: '0',
		notesId : ["a7", "as7", "b7", "c0", "cs0", "d0", "ds0", "e0", "f0", "fs0", "g0", "gs0", "a0", "as0", "b0", "c1", "cs1", "d1", "ds1", "e1", "f1", "fs1", "g1", "gs1", "a1", "as1", "b1", "c2", "cs2", "d2", "ds2", "e2", "f2", "fs2", "g2", "gs2", "a2", "as2", "b2", "c3", "cs3", "d3", "ds3", "e3", "f3", "fs3", "g3", "gs3", "a3", "as3", "b3", "c4", "cs4", "d4", "ds4", "e4", "f4", "fs4", "g4", "gs4", "a4", "as4", "b4", "c5", "cs5", "d5", "ds5", "e5", "f5", "fs5", "g5", "gs5", "a5", "as5", "b5", "c6", "cs6", "d6", "ds6", "e6", "f6", "fs6", "g6", "gs6", "a6", "as6", "b6", "c7"],
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
				return '/audio/'+ id +'.wav.mp3';
			return false;
		},

		getAllSounds : function (callback) {
			var self = this,
				id = '';

			for (var i = 0; i < this.notesId.length; i++) {
				id = this.notesId[i];
				self.addSound(id);

			};
		},

		addSound : function (id) {
			var self = this,
				request = new XMLHttpRequest(),
				urlRequest = self.getUrl(id),
				bufferAudio = null,
				context = self.context,
				sound = {},
				async = true;

			if( urlRequest ) {
				
				request.open('GET', urlRequest, async);
				request.responseType = 'arraybuffer';

				request.onload = function() {
					context.decodeAudioData(request.response, function(buffer) {
						sound.id = id;
						sound.buffer = buffer;
						self.addSoundToArray(sound);
					});
				}

				request.send();

			}

		},

		addSoundToArray : function (sound) {
			var self = this;

			self.sounds.push(sound);

			if(self.sounds.length === 88) {
				$(window).trigger('notesLoaded');
			}
		},

		init: function() {
			try {

				window.AudioContext = window.AudioContext || window.webkitAudioContext;
				this.context = new AudioContext();
				this.loadConfigNotes(); //carrega configuração das notas, separadas pelas oitavas
				this.initSocket();
			 }

			 catch(e) {

			 	console.log('Web Audio API is not supported in this browser', e);

			 }

		},

		initSocket : function () {
			var self = this,
				buffer = null;

			self.io = io(); // Inicializando socket

			self.io.on('note', function (id){
				//console.log('note::socket', id);
				buffer = PianoUtils.getObjByProperty('id',id, self.sounds).buffer;
				self.playSound(buffer);
			});
		},

		playSound: function (buffer) {
			var self = this,
				source = self.context.createBufferSource();

			source.buffer = buffer;
			source.connect(self.context.destination);
			source.start(0);
			PianoUtils.sleep(200);
		},

		loadSound: function(id) {
			var self = this,
				isCachedSound = PianoUtils.findByProperty('id', id, this.sounds),
				buffer = null;

			if (isCachedSound) {
				buffer = PianoUtils.getObjByProperty('id',id, self.sounds).buffer;
				self.io.emit('note', id);
				self.playSound(buffer);
			} else {
				buffer = self.getSound(id);
				self.io.emit('note', id);
				self.playSound(buffer);
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
				splitedTextLength = splitedText.length,
				regexForNumber = new RegExp('^[0-9]$'),
				note = '',
				letter = '',
				number = null,
				sound = null;

			if (splitedTextLength > 0) {

				for (var i=0; i < splitedTextLength; i++) {

					if (!self.notesLoaded) {
						self.loadConfigNotes();
					} 

					letter = splitedText[i];

					if ( letter == ' ') {

						PianoUtils.sleep(200);

					} else {

						if (regexForNumber.test(letter)) {
							number = parseInt(letter, 10);

							if (number >= 0 && number <= 8) { //oitavas de 1 a 7
								self.setOctave(number);
							} else {
								throw "Texto inválido";
							}

						} else {

							note = self.getNoteByLetter(letter);

							if ( note ) {
								if( self.octave == '8' ) {
									if (note == 'la' || note == 'si' ) {
										if ( self.notes[self.octave][note] ) {
											sound = self.notes[self.octave][note];
											self.loadSound(sound);

										} else {
											throw "Texto inválido";

										}
									}
								} else {

									if ( self.notes[self.octave][note] ) {
										sound = self.notes[self.octave][note];
										self.loadSound(sound);

									} else {
										throw "Texto inválido";

									}
								}
							}
						}
					}

				}

			} else {

				throw "Texto inválido!"

			}

		},

		createOscillator : function(frequency, wave) {
			this.oscillator = this.context.createOscillator(),
			this.analyser = this.context.createAnalyser();

			if( frequency && wave ) {
				this.analyser.connect(this.context.destination);
				this.oscillator.connect(this.context.destination);
				this.oscillator.frequency.value = parseInt(frequency, 10);
				this.oscillator.type = parseInt(wave, 10);
				this.oscillator.start(0);
			}

		},

		stopOscillator : function () {
			if( this.oscillator ) {
				this.oscillator.stop();
			}
		},

		getNoteByLetter : function (letter) {
			var self = this;
			if ( self.enumNotes[letter] )
				return self.enumNotes[letter];
			return undefined;
		},

		setOctave : function (octave) {
			this.octave = octave;
		}
	}
}