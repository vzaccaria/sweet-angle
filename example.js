angular.module('application').directive('progressBar', function () {
    console.log(arguments);
    var ret = {};
    ret.restrict = 'A';
    ret.template = '<div><link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/0.13.0/css/semantic.css"/><div ng-class="[visibility, color]" class="ui progress transition active"><div style="{{bsize}}" class="bar"></div></div></div>';
    ret.replace = true;
    ret.scope = {};
    ret.scope.value = '=';
    ret.scope.color = '@';
    ret.scope.max = '@';
    ret.scope.callback = '&';
    ret.link = function (s) {
        (function (elem, attr) {
            this.visibility = 'hidden';
            this.elem = elem;
            this.toggle = function () {
                if (this.visibility === 'hidden') {
                    this.visibility = '';
                } else {
                    this.visibility = 'hidden';
                }
                this.onValueChange();
            }.bind(this);
            this.onValueChange = function () {
                var perc;
                perc = this.value / parseFloat(this.max) * window.jQuery(this.elem).width();
                this.bsize = 'width: ' + perc + 'px;';
            }.bind(this);
            this.$watch('value', this.onValueChange);
        }.apply(s, Array.prototype.slice.call(arguments, 1)));
    };
    return ret;
});
angular.module('application').directive('xy', function (a, b) {
    console.log(arguments);
    var ret = {};
    ret.restrict = 'A';
    ret.template = '<div></div>';
    ret.replace = true;
    ret.scope = {};
    ret.scope.c = '=';
    ret.scope.d = '=';
    ret.scope.e = '@';
    ret.scope.f = '@';
    ret.scope.g = '&';
    ret.scope.h = '&';
    ret.link = function (s) {
        s.a = a;
        s.b = b;
        (function (e, a$2) {
        }.apply(s, Array.prototype.slice.call(arguments, 1)));
    };
    return ret;
});
angular.module('application').directive('xy', function () {
    console.log(arguments);
    var ret = {};
    ret.restrict = 'A';
    ret.template = '<div></div>';
    ret.replace = true;
    ret.scope = {};
    ret.scope.c = '=';
    ret.scope.d = '=';
    ret.scope.e = '@';
    ret.scope.f = '@';
    ret.scope.g = '&';
    ret.scope.h = '&';
    ret.link = function (s) {
        (function (e, a) {
        }.apply(s, Array.prototype.slice.call(arguments, 1)));
    };
    return ret;
});
