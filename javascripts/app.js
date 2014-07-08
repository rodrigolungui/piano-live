'use strict';

(function($, w){

	var App = function () {
		return {
			container: $('#piano-live'),

			bindEvents: function () {
				var self = this;

				this.container.find('#main-notes a').click( function( ){
					var id = $(this).attr('id');

					w.audioComponent.loadSound(id);
					return false;
				});

				this.configTabs();
				this.setOscillatorFunctionality();
				this.setSoundGeneratorFunctionality();
			},

			setSoundGeneratorFunctionality : function () {
				var self = this,
					text = '';

				this.container.find('#generate-sound').click(function () {
					text = self.container.find('.sound-text').val();
					w.audioComponent.decodeSound(text);
				});
			},

			setOscillatorFunctionality : function () {
				this.container.find('#create-oscillator').click(function () {
					var frequency = $('#fr').val(),
						wave = $('#wave').val();

					w.audioComponent.createOscillator(frequency, wave);
				});


				this.container.find('#stop-oscillator').click(function () {
					w.audioComponent.stopOscillator();
				})
			},

			configTabs : function () {
				var self = this; 

				this.container.find('.tab-structure #sound-generator').click(function(){
					self.container.find('.tab-header .oscillator').removeClass('active');
					self.container.find('.tab-header .sound-generator').addClass('active');
					self.container.find('.tab-content.sound-generator').removeClass('dn');
					self.container.find('.tab-content.oscillator').addClass('dn');
					return false;
				});

				this.container.find('.tab-structure #oscillator').click(function(){
					self.container.find('.tab-header .oscillator').addClass('active');
					self.container.find('.tab-header .sound-generator').removeClass('active');
					self.container.find('.tab-content.oscillator').removeClass('dn');
					self.container.find('.tab-content.sound-generator').addClass('dn');
					return false;
				});
			},

			initAudioComponent : function () {
				var self = this,
					$elLoader = self.container.find('.wrapper-loader');

				w.audioComponent = new AudioComponent();
				w.audioComponent.init();
				w.audioComponent.getAllSounds();

				$elLoader.toggleClass('hide');

				$(window).on('notesLoaded', function () {
					self.container.find('.info-notes').toggleClass('opaque');
					self.container.find('#main-notes').toggleClass('loading');
					$elLoader.toggleClass('hide');
				});
			},

			init: function () {
				this.initAudioComponent();
				this.bindEvents();
			}
		}
	}


	var app = new App();
	app.init();

})(jQuery, window, undefined);