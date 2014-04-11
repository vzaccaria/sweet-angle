

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
		letstx $newTemp  = [makeValue(rendered, #{here})];
		letstx $name_str = [makeValue(unwrapSyntax(#{$name}), #{here})];
		letstx $app_str  = [makeValue(root.sa.application, #{here})];
	
		return #{
			angular.module($app_str).directive($name_str, function ($($iparams) (,) ...) {

				console.log(arguments);
				var ret      = {};
				ret.restrict = 'A';
				ret.template = $newTemp;
				ret.replace  = true;
				ret.scope = {} ;
				$(ret.scope.$attrib = '=';) ...
				$(ret.scope.$ex = '@';) ...
				$(ret.scope.$cb = '&';) ...
				ret.link = function(s){
				  		$(s.$iparams = $iparams;) ...
		  				(function ( $($mparams) (,) ... ) $mbody)
		  					.apply(s, Array.prototype.slice.call(arguments, 1)) 
		  			  } 
		  		return ret;
			})
		  };
	}
}


macro @ {
	case { _ . $x } => { return #{ this.$x }; }
	case { _ ; } => { return #{ this; }; } 
	case { _ $x } => { return #{ this.$x }; }
}

let init = macro {
	case { _ } => {
		return #{
			window.$$ = function(sel) {
				return angular.element(document.querySelector(sel)).isolateScope();
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

export init
export @
export ~ 
export directive