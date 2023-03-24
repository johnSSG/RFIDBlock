var RFIDBlock_encoding_types = {
	hexidecimal:'HEXIDECIMAL',
	base64:'BASE64'
};
function RFIDBlock(selector, options, callback){
	// read resulting unicode as a byte array and convert to hex string
	// when writing, convert hex string to byte array, then to a unicode string
	var rfidEvent = {};
	var _this = this;
	this.init = function(){
		_this.defaults = {
			action:null,
			tag:"",
			encoding_write:RFIDBlock_encoding_types.hexidecimal,
			encoding_read:RFIDBlock_encoding_types.hexidecimal
		}
		if (typeof options === 'object'){
			_this.settings = $.extend({}, _this.defaults, options);
		} else {
			_this.settings = _this.defaults;
			_this.settings.tag = options;
		}
		
		if(detectIE() === false){
			_this.changeEncodingEvent = new CustomEvent('changeBlockRFIDEncoding',{
				detail: {
					read_encoding:_this.settings.encoding_read,
					write_encoding:_this.settings.encoding_write
				},
				bubbles:true,
			});
			if (_this.settings.action != 'read'){	
				/*if (_this.settings.encoding_write == RFIDBlock_encoding_types.base64){
					
				} else if (_this.settings.encoding_write == RFIDBlock_encoding_types.hexidecimal){
					_this.settings.action = _this.hexToAscii(_this.settings.action);
				}*/
				
				rfidEvent = new CustomEvent('rfidBlockWrite',{
					detail: {
					tag:_this.settings.tag
					},
					bubbles:true,
				});
			} else {
				//console.log("setting read");
				rfidEvent = new CustomEvent('rfidBlockRead');
			}
			
			this.events();
		}
		
	}
	
	this.events = function(){
		//console.log("dispatching encoding event");
		//console.log(_this.changeEncodingEvent);
			
		//console.log("dispatch encoding");
		document.dispatchEvent(_this.changeEncodingEvent);
		if (_this.settings.action != null){
			$(document).on("rfidBlock", function(response){
				console.log("on rfid block");
				if (typeof callback === 'function'){
					console.log(response);
					if (typeof response.detail !== 'undefined' && typeof response.detail.tag !== 'undefined'){
						if (_this.settings.encoding_read == RFIDBlock_encoding_types.base64){
							// treat tag as a unicode string, convert to byte array
							// convert byte array into a hex string by getting every two bytes
							// the byte array should be of length 48, if less create a new array and copy n'th 0s then the rest
							// if more, cut off the values
							callback(response.detail.tag);
						} else if (_this.settings.encoding_read == RFIDBlock_encoding_types.hexidecimal){
							console.log(response.detail.tag);
							callback(response.detail.tag.toUpperCase());
						}
					} else {
						callback(response);
					}
				}
			});
	    
			$(document).on("click", selector, function(){
				console.log("dispatching event");
				console.log(rfidEvent);
				document.dispatchEvent(rfidEvent);
			});
		}
	}
	
	this.read = function(callback){
		$(document).one("rfidBlock", function(response){
			console.log("on rfid block");
			if (typeof callback === 'function'){
				console.log(response);
				if (typeof response.detail !== 'undefined' && typeof response.detail.tag !== 'undefined'){
					if (_this.settings.encoding_read == RFIDBlock_encoding_types.base64){
						// treat tag as a unicode string, convert to byte array
						// convert byte array into a hex string by getting every two bytes
						// the byte array should be of length 48, if less create a new array and copy n'th 0s then the rest
						// if more, cut off the values
						callback(response.detail.tag);
					} else if (_this.settings.encoding_read == RFIDBlock_encoding_types.hexidecimal){
						console.log(response.detail.tag);
						callback(response.detail.tag.toUpperCase());
					}
				} else {
					callback(response);
				}
			}
		});
		
		var readEvent = new CustomEvent('rfidBlockRead');
		document.dispatchEvent(readEvent);
	}
	
	this.write = function(tag, callback){
		$(document).one("rfidBlock", function(response){
			console.log("on rfid block");
			if (typeof callback === 'function'){
				console.log(response);
				if (typeof response.detail !== 'undefined' && typeof response.detail.tag !== 'undefined'){
					if (_this.settings.encoding_read == RFIDBlock_encoding_types.base64){
						// treat tag as a unicode string, convert to byte array
						// convert byte array into a hex string by getting every two bytes
						// the byte array should be of length 48, if less create a new array and copy n'th 0s then the rest
						// if more, cut off the values
						callback(response.detail.tag);
					} else if (_this.settings.encoding_read == RFIDBlock_encoding_types.hexidecimal){
						console.log(response.detail.tag);
						callback(response.detail.tag.toUpperCase());
					}
				} else {
					callback(response);
				}
			}
		});
		var writeEvent = new CustomEvent('rfidBlockWrite',{
			detail: {
			tag:tag
			},
			bubbles:true,
		});
		
		document.dispatchEvent(writeEvent);
	}
	
	this.strToHex = function(str) {
		var hex = '';
		for(var i=0;i<str.length;i++) {
			console.log(str[i]);
			console.log(str[i].charCodeAt(0));
			hex += ''+str[i].charCodeAt(0).toString(16);
			console.log(hex);
		}
		return hex;
	}
	
	this.hexToAscii = function(hexStr){
		var output = '';
		var hexArray = hexStr.match(/.{1,2}/g);
		for (var i = 0; i < hexArray.length; i++){
			output += String.fromCharCode(parseInt(hexArray[i],16));
		}
		
	}
	
	this.formatHexstring = function(val){
		console.log(val);
		if (val.length < 24){
			var numOfZeros = 24 - val.length;
			for (var i = numOfZeros; i > 0; i--){
				val = '0'+val;
			}
		} else {
			val = val.substr(0, 24);
		}
		
		return val;
	}
	
	this.init();
}

/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    /*var edge = ua.indexOf('Edge/');
    if (edge > 0) {
       // Edge (IE 12+) => return version number
       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }*/

    // other browser
    return false;
}
