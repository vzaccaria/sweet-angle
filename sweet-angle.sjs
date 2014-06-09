
root = {}

let commitDirective = macro {
	case {_
		  $name 
	} => {

		letstx $name_str = [makeValue(unwrapSyntax(#{$name}), #{here})];
		letstx $app_str  = [makeValue(root.sa.application, #{here})];
	

		return #{
				angular.module($app_str).directive($name_str, window.sweetAngle[$name_str].buildDirective)
		};
	}
}

/* Overall framework is from: https://gist.github.com/aaronpowell/9085724 */
let directive = macro {
	case {_
		  $name {
                       import   $($iparams)  (,) ...;
                       byref    $($attrib)   (,) ...;
                       byval    $($ex)       (,) ...;
                       callback $($cb)       (,) ...;
                       template $template;
                       create ($($mparams) (,) ...) $mbody
		 }
	} => {
		// From: https://github.com/mozilla/sweet.js/issues/178
		var temp         = #{$template}[0];
		var tempString   = temp.token.value.raw;
		var jade         = require('jade');
		var rendered     = jade.render(tempString);
		root[unwrapSyntax(#{$name})] = rendered;
		letstx $newTemp  = [makeValue(rendered, #{here})];
		letstx $name_str = [makeValue(unwrapSyntax(#{$name}), #{here})];
		letstx $app_str  = [makeValue(root.sa.application, #{here})];
	
		return #{

				var ret      = {};
				ret.restrict = 'A';
				ret.template = $newTemp;
				ret.replace  = true;
				ret.scope = {} ;
				$(ret.scope.$attrib = '=';) ...
				$(ret.scope.$ex = '@';) ...
				$(ret.scope.$cb = '&';) ...

				ret.buildDirective = function ($($iparams) (,) ...) {

					window.sweetAngle[$name_str].link = function(s){
					  		$(s.$iparams = $iparams;) ...
			  				(function ( $($mparams) (,) ... ) $mbody)
			  					.apply(s, Array.prototype.slice.call(arguments, 1)) 
			  			  } 
			  		return window.sweetAngle[$name_str];
			  	};

				window.sweetAngle[$name_str] = ret

		  };
	}
}

let extend = macro {
	case {_
		  $old into $name {
                       import   $($iparams)  (,) ...;
                       byref    $($attrib)   (,) ...;
                       byval    $($ex)       (,) ...;
                       callback $($cb)       (,) ...;
                       template $template;
                       create ($($mparams) (,) ...) $mbody
		 }
	} => {
		// From: https://github.com/mozilla/sweet.js/issues/178
		var temp         = #{$template}[0];
		var tempString   = temp.token.value.raw;
		localNewName = unwrapSyntax(#{$name});
		localOldName = unwrapSyntax(#{$old});
		var jade         = require('jade');
		var rendered     = jade.render(tempString, { parent: root[localOldName]});
		root[localNewName] = rendered;
		letstx $newTemp  = [makeValue(rendered, #{here})];
		letstx $old_str  = [makeValue(unwrapSyntax(#{$old}), #{here})];
		letstx $name_str = [makeValue(unwrapSyntax(#{$name}), #{here})];
		letstx $app_str  = [makeValue(root.sa.application, #{here})];
	
		return #{

				var ret      = {}
				ret.restrict = 'A';
				ret.template = $newTemp;
				ret.replace  = true;
				ret.scope = {}
				var scopeKeys = Object.keys(window.sweetAngle[$old_str].scope);
				for (var i = 0; i < scopeKeys.length; i++) {
					if(typeof window.sweetAngle[$old_str].scope[scopeKeys[i]] == "string") {
						ret.scope[scopeKeys[i]] = window.sweetAngle[$old_str].scope[scopeKeys[i]];
					}
				};
				$(ret.scope.$attrib = '=';) ...
				$(ret.scope.$ex = '@';) ...
				$(ret.scope.$cb = '&';) ...

				ret.buildDirective = function ($($iparams) (,) ...) {

					window.sweetAngle[$name_str].link = function(s, elem, param){
							window.sweetAngle[$old_str].link(s, elem, param);
					  		$(s.$iparams = $iparams;) ...
			  				(function ( $($mparams) (,) ... ) $mbody)
			  					.apply(s, Array.prototype.slice.call(arguments, 1)) 
			  			  } 
			  		return window.sweetAngle[$name_str];
			  	};

				window.sweetAngle[$name_str] = ret;

		  };
	}
}

macro @ {
	case { _ . $x } => { return #{ this.$x }; }
	case { _ ; } => { return #{ this; }; } 
	case { _ $x } => { return #{ this.$x }; }
	case { _ } => { return #{ this }; }
}

let sweetInit = macro {
	case { _ } => {
		return #{
			window.sweetAngle = {};
			window.$$ = function(sel) {
				return angular.element(document.querySelector(sel)).isolateScope();
			}
		}
	}
}

let sweetInitOld = macro {
	case { _ } => {
		return #{
			window.sweetAngle = {};
			window.$$ = function(sel) {
				return angular.element(sel).scope();
			}
		}
	}
}


let  ~ = macro {
	case { _ $x } => {
		return #{
			.then($x)
		}
	}
}

export directive
export commitDirective
export sweetInit
export sweetInitOld
export @
export ~ 
export extend
