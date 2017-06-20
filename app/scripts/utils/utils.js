(function() {
    angular.module('hello').factory('Utils', [

        function() {
            var obj = {};

            obj.ucfirst = function(str) {
                //  discuss at: http://phpjs.org/functions/ucfirst/
                // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // bugfixed by: Onno Marsman
                // improved by: Brett Zamir (http://brett-zamir.me)
                //   example 1: ucfirst('kevin van zonneveld');
                //   returns 1: 'Kevin van zonneveld'

                str += '';
                var f = str.charAt(0)
                    .toUpperCase();
                return f + str.substr(1);
            };

            obj.trim = function(str, charlist) {
                //  discuss at: http://phpjs.org/functions/trim/
                // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // improved by: mdsjack (http://www.mdsjack.bo.it)
                // improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
                // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // improved by: Steven Levithan (http://blog.stevenlevithan.com)
                // improved by: Jack
                //    input by: Erkekjetter
                //    input by: DxGx
                // bugfixed by: Onno Marsman
                //   example 1: trim('    Kevin van Zonneveld    ');
                //   returns 1: 'Kevin van Zonneveld'
                //   example 2: trim('Hello World', 'Hdle');
                //   returns 2: 'o Wor'
                //   example 3: trim(16, 1);
                //   returns 3: 6

                var whitespace, l = 0,
                    i = 0;
                str += '';

                if (!charlist) {
                    // default list
                    whitespace =
                        ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
                } else {
                    // preg_quote custom list
                    charlist += '';
                    whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
                }

                l = str.length;
                for (i = 0; i < l; i++) {
                    if (whitespace.indexOf(str.charAt(i)) === -1) {
                        str = str.substring(i);
                        break;
                    }
                }

                l = str.length;
                for (i = l - 1; i >= 0; i--) {
                    if (whitespace.indexOf(str.charAt(i)) === -1) {
                        str = str.substring(0, i + 1);
                        break;
                    }
                }

                return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
            };

            obj.empty = function(obj) {
                if (obj === null || typeof(obj) === 'undefined' || obj === "") {
                    return true;
                }
                if ((!obj && obj !== false) || (obj.length === 0)) {
                    return true;
                }
                if (("" + obj).replace(/\s/g, "") === "") {
                    return true;
                }
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        return false;
                    }
                }
                return false;
            };
            /**
             * Remplace les accents de la chaine de caractères par une lettre non accentuée.
             * @param str chaine avec accent
             * @param generateRegExp
             * @returns chaine sant accent
             */
            obj.toNoAccent = function(str, generateRegExp) {
                var accents = [{
                    accent: 'àâã',
                    no: 'a'
                }, {
                    accent: 'ç',
                    no: 'c'
                }, {
                    accent: 'èéêëēęěĕė',
                    no: 'e'
                }, {
                    accent: 'ìíîïīĩĭįı',
                    no: 'i'
                }, {
                    accent: 'òóôõöøōőŏœ',
                    no: 'o'
                }, {
                    accent: 'ùúûüūůűŭũų',
                    no: 'u'
                }];
                if (generateRegExp) {
                    for (var i = 0; i < accents.length; i++) {
                        str = str.replace(new RegExp('[' + accents[i].accent + accents[i].no + ']', 'gi'), '[' + accents[i].accent + accents[i].no + ']');
                    }
                } else {
                    for (var j = 0; j < accents.length; j++) {
                        str = str.replace(new RegExp('[' + accents[j].accent + ']', 'gi'), accents[j].no);
                    }
                }
                return str;
            };
            /**
             * Gère le highlight
             * @param value la chaine complete
             * @param term le morceau de chaine qui doit etre mis en valeur
             * @returns la chaine mise en valeur
             */
            obj.highlight = function(value, term) {
                if (term !== null && typeof term !== 'undefined') {
                    //term = term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1");
                    term += "|" + toNoAccent(term, true);
                    return value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + term + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
                } else {
                    return value;
                }
            };

            obj.toUnicode = function(theString) {
                var unicodeString = '';
                for (var i = 0; i < theString.length; i++) {
                    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
                    while (theUnicode.length < 4) {
                        theUnicode = '0' + theUnicode;
                    }
                    theUnicode = '\\u' + theUnicode;
                    unicodeString += theUnicode;
                }
                return unicodeString;
            };

            obj.stripslashes = function(str) {
                //       discuss at: http://phpjs.org/functions/stripslashes/
                //      original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                //      improved by: Ates Goral (http://magnetiq.com)
                //      improved by: marrtins
                //      improved by: rezna
                //         fixed by: Mick@el
                //      bugfixed by: Onno Marsman
                //      bugfixed by: Brett Zamir (http://brett-zamir.me)
                //         input by: Rick Waldron
                //         input by: Brant Messenger (http://www.brantmessenger.com/)
                // reimplemented by: Brett Zamir (http://brett-zamir.me)
                //        example 1: stripslashes('Kevin\'s code');
                //        returns 1: "Kevin's code"
                //        example 2: stripslashes('Kevin\\\'s code');
                //        returns 2: "Kevin\'s code"

                return (str + '')
                    .replace(/\\(.?)/g, function(s, n1) {
                        switch (n1) {
                            case '\\':
                                return '\\';
                            case '0':
                                return '\u0000';
                            case '':
                                return '';
                            default:
                                return n1;
                        }
                    });
            };

            obj.addslashes = function(str) {
                /*            return (str + '')
            .replace(/[\\"']/g, '\\$&')
            .replace(/\u0000/g, '\\0');*/
                return str.replace(/\\/g, '\\\\').
                replace(/\u0008/g, '\\b').
                replace(/\t/g, '\\t').
                replace(/\n/g, '\\n').
                replace(/\f/g, '\\f').
                replace(/\r/g, '\\r').
                replace(/'/g, '\\\'').
                replace(/"/g, '\\"');
            };

            obj.padding = function(str, len, pad, dir) {

                var STR_PAD_LEFT = 1;
                var STR_PAD_RIGHT = 2;
                var STR_PAD_BOTH = 3;
                /**
                 * Util pour faire du padding
                 * @param str la chaine à padder
                 * @param len la taille de la nouvelle chaine
                 * @param pad le caractère de padding
                 * @param dir direction (Left : STR_PAD_LEFT, Right : STR_PAD_RIGHT, both : STR_PAD_BOTH)
                 * @returns la chaine paddée
                 */

                if (typeof(len) === "undefined") {
                    len = 0;
                }
                if (typeof(pad) === "undefined") {
                    pad = ' ';
                }
                if (typeof(dir) === "undefined") {
                    dir = STR_PAD_RIGHT;
                }

                if (len + 1 >= str.length) {
                    switch (dir) {
                        case STR_PAD_LEFT:
                            str = Array(len + 1 - str.length).join(pad) + str;
                            break;
                        case STR_PAD_BOTH:
                            var right = Math.ceil((padlen = len - str.length) / 2);
                            var left = padlen - right;
                            str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                            break;
                        default:
                            str = str + Array(len + 1 - str.length).join(pad);
                            break;
                    }
                }
                return str;
            };
            //Secondes de haute précision pour les dates
            obj.dateNano = function() {
                window.performance = window.performance || {};
                performance.now = (function() {
                    return performance.now ||
                        performance.mozNow ||
                        performance.msNow ||
                        performance.oNow ||
                        performance.webkitNow ||
                        function() {
                            return new Date().getTime();
                    };
                })();
                return performance.now();
            };
            //strip non-numeric characters from string
            obj.getNumeriqueValue = function(str) {
                var numericString = str.replace(/[^0-9]/g, '');
                return numericString;
            };

            obj.getDateNano = function(longeur) {

                var currentDateFull = moment().format("YYYYMMDDHHmmss");
                var secondesNanoNum;
                var secondesNanoString;
                var nanoString;
                var superDateNanoString;

                secondesNanoNum = obj.dateNano();
                secondesNanoString = secondesNanoNum.toString();
                nanoString = obj.getNumeriqueValue(secondesNanoString);
                superDateNanoString = currentDateFull.concat(nanoString);

                return superDateNanoString.substring(0, longeur);
            };

            obj.toISOString = function(date) {
                return date.getFullYear() +
                    '-' + this.padding(date.getMonth() + 1, 2, '0', 1) +
                    '-' + this.padding(date.getDate(), 2, '0', 1) +
                    'T' + this.padding(date.getHours(), 2, '0', 1) +
                    ':' + this.padding(date.getMinutes(), 2, '0', 1) +
                    ':' + this.padding(date.getSeconds(), 2, '0', 1);
            };

            obj.getRandomString = function(longeur) {
                var str = "";
                while (str.length < longeur && longeur > 0) {
                    var r = Math.random();
                    str += String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65));
                }
                return str;
            };

            //Sorting product list by idBac
            obj.sortByIdbac = function(list) {
                //                console.log('avant transformation', list);
                var sorted = _.sortBy(list,
                    function(item) {
                        return !item.comptabilisable;
                    });
                //                console.log('apres transformation', sorted);
                return sorted;
            };

            return obj;
        }
    ]);
})();