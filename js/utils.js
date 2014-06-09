var PianoUtils = {
	findByProperty : function (property, value, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr && property && value && arr[i][property] == value){
				return true;
			}				
		}
		return false;
	},

	getObjByProperty : function (property, value, arr) {
		for (var i = 0; i < arr.length; i++) {
			if (arr && property && value && arr[i][property] == value){
				return arr[i];
			}
		}
		return undefined;
	},

	sleep: function(milliseconds) {
	  var start = new Date().getTime();
	  for (var i = 0; i < 1e7; i++) {
	    if ((new Date().getTime() - start) > milliseconds){
	      break;
	    }
	  }
	}
}