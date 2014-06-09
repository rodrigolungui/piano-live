(function($, w){

	var App = function () {
		return {
			container: $('#piano-live'),

			bindEvents: function () {
				var self = this;

				this.container.find('a').click( function( ){
					var id = $(this).attr('id');

					w.audioComponent.loadSound(id);

					console.log(id)

					return false;
				});

				this.container.find('#generate-sound').click( function () {
					var text = self.container.find('.sound-text').val();
					w.audioComponent.decodeSound(text);
				});
			},

			init: function () {
				console.log('init::app');
				this.bindEvents();
			}
		}
	}


	var app = new App();
	app.init();

})(jQuery, window, undefined);