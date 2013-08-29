(function ($) {
    $.widget("numericfield", {
        options: {
            maxValue: null,
            minValue: null,
            decimalPlaces: 0,
            stepUp: 1,
            stepDown: 1,
            allowSteps: true,
            specialAllowedKeys: [35, 36, 37, 38, 39, 40, 46, 8, 9, 27, 13], // Allows ESC, ENTER, TAB, HOME, END, DELETE, BACKSPACE, ARROWS
            ctrlAllowedKeys: [65, 67, 86], // Allows ctrl+a, ctrl+c e ctrl+v
            realTimeChange: false,
            quietMillis: 300
        },

        _create: function () {
            var self = this;
            var el = this.element;
            var o = this.options;
            var eventTreated = false;

            this.name = 'numericfield';
            this.previousValue = null;
            this.options.regex = this._buildRegex();

            el.on('focus.' + this.name, function (event) {
                self.previousValue = self._getValue();
            });

            el.on('blur.' + this.name, function (event) {
                el.val(self._properFormat(el.val()));
                self._ensureValidValue(false, true);

                if (self._getValue() !== self.previousValue)
                    self._raiseOnChange(false, true);
            });

            el.on('keydown.' + this.name, function (event) {
                if ($.inArray(event.which, o.specialAllowedKeys) != -1) {
                    eventTreated = true;

					if (event.which === 38) {
						self.stepUp(true);
					} else if (event.which === 40) {
						self.stepDown(true);
					}
                }
                else if (event.ctrlKey === true && $.inArray(event.which, o.ctrlAllowedKeys) != -1)
                    eventTreated = true;
                else
                    eventTreated = false;
            });

            el.on('keypress.' + this.name, function (event) {
                if (eventTreated === true) {
                    eventTreated = false;
                    return;
                }

                var selection = self._getSelection();
                var value = (el.val() || '').toString();

                var newChar = String.fromCharCode(event.which);
                var newValue = value.substring(0, selection.start) + newChar + value.substr(selection.end);

                var result = o.regex.exec(newValue);
                if (result === null || result.length <= 0 || result[0] !== newValue)
                    event.preventDefault();

                self._ensureValidValue(true);
            });

            el.on('keyup.' + this.name, function (event) {
                self._ensureValidValue(true);
            });
        },

        _init: function () {
            this._ensureValidValue(false);
        },

        _setOption: function (key, value) {
            $.Widget.prototype._setOption.apply(this, arguments);
			
            if (key === 'minValue' || key === 'decimalPlaces')
                this._setOption('regex', this._buildRegex());

            if (key === 'maxValue' || key === 'minValue' || key === 'decimalPlaces')
                this._ensureValidValue(false);
        },

        _ensureValidValue: function (acceptInvalidValue, doNotRaiseChange) {
            var el = this.element;
            var o = this.options;
            var textValue = this._properFormat(el.val());
            var currentValue = parseFloat(textValue);

            if ((textValue === '' || textValue === '-') && acceptInvalidValue)
                return;

            if (isNaN(currentValue)) {
                el.val(0);
                currentValue = 0;

                if(!doNotRaiseChange)
                    this._raiseOnChange();
            }

            if (o.minValue !== null && currentValue < o.minValue && !acceptInvalidValue) {
                el.val(o.minValue);
                currentValue = o.minValue;

                if (!doNotRaiseChange)
                    this._raiseOnChange();
            }

            if (o.maxValue !== null && currentValue > o.maxValue && !acceptInvalidValue) {
                el.val(o.maxValue);
                currentValue = o.maxValue;

                if (!doNotRaiseChange)
                    this._raiseOnChange();
            }
			
			if (currentValue !== this._roundNumber(currentValue)) {
                currentValue = this._roundNumber(currentValue);
				el.val(currentValue);
                
                if(!doNotRaiseChange)
                    this._raiseOnChange();
            }
        },

        _properFormat: function (value) {
            value = (value || '').toString();

			if(value.length > 0 && value.charAt(0) === '.')
				value = '0' + value;
			
            if (value.length > 0 && value.charAt(value.length - 1) === '.')
                value = value.substr(0, value.length - 1);

			if(parseFloat(value) === 0 && value.charAt(0) === '-')
				value = '0';
				
            return value;
        },

		_roundNumber: function(value) {
			if(this.options.decimalPlaces <= 0)
				return Math.round(value);
			
			var multiplier = Math.pow(10, this.options.decimalPlaces);
			return Math.round(value * multiplier) / multiplier;
		},
		
        _getSelection: function () {
            var el = this.element[0];
            var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;

            if (typeof el.selectionStart === "number" && typeof el.selectionEnd === "number") {
                start = el.selectionStart;
                end = el.selectionEnd;
            } else if (document.selection) {
                range = document.selection.createRange();

                if (range && range.parentElement() === el) {
                    len = el.value.length;
                    normalizedValue = el.value.replace(/\r\n/g, "\n");

                    textInputRange = el.createTextRange();
                    textInputRange.moveToBookmark(range.getBookmark());

                    endRange = el.createTextRange();
                    endRange.collapse(false);

                    if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                        start = end = len;
                    } else {
                        start = -textInputRange.moveStart("character", -len);
                        start += normalizedValue.slice(0, start).split("\n").length - 1;

                        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                            end = len;
                        } else {
                            end = -textInputRange.moveEnd("character", -len);
                            end += normalizedValue.slice(0, end).split("\n").length - 1;
                        }
                    }
                }
            }

            return {
                start: start,
                end: end
            };
        },

        _buildRegex: function () {
            var o = this.options;
            var regex = (o.minValue < 0 ? '^-?\\d*' : '^\\d+') + (o.decimalPlaces > 0 ? '(.\\d{0,' + o.decimalPlaces + '})?' : '');
            return new RegExp(regex);
        },

        _getValue: function () {
            var el = this.element;
            var textValue = this._properFormat(el.val());
            var currentValue = parseFloat(textValue);

            return currentValue;
        },

        _setValue: function (value, useQuietMillis, bypassRealTimeChangeOption) {
            var el = this.element;
            el.val(value);

            this._ensureValidValue(false, true);
            this._raiseOnChange(useQuietMillis, bypassRealTimeChangeOption);
        },
		
        _raiseOnChange: (function () {
            var timeout;

            return function (useQuietMillis, bypassRealTimeChangeOption) {
                var self = this;
                var raise = self.options.realTimeChange || bypassRealTimeChangeOption;
                window.clearTimeout(timeout);

                if (raise) {
                    var quietMillis = self.options.quietMillis;
                    useQuietMillis = useQuietMillis && quietMillis > 0;

                    if (useQuietMillis) {
                        timeout = window.setTimeout(function () {
                            var el = self.element;
                            el.change();
                            self.previousValue = self._getValue();
                        }, quietMillis);
                    } else {
                        var el = self.element;
                        el.change();
                        self.previousValue = self._getValue();
                    }
                }
            }
        })(),

        destroy: function () {
            var el = this.element;
            el.off('.' + this.name);

            $.Widget.prototype.destroy.call(this);
        },

        value: function (val) {
            if (arguments.length == 0)
                return this._getValue();
            else {
                this._setValue(val || 0, false, true);
                return this._getValue();
            }
        },

        stepUp: function (useQuietMillis, step) {
			if (!this.options.allowSteps)
				return;
		
            var stepUp = (arguments.length > 1 ? step : this.options.stepUp);

            if (typeof (stepUp) !== 'number')
                return;

            this._setValue(this._getValue() + stepUp, useQuietMillis);
        },

        stepDown: function (useQuietMillis, step) {
			if (!this.options.allowSteps)
				return;
		
            var stepDown = (arguments.length > 1 ? step : this.options.stepDown);

            if (typeof (stepDown) !== 'number')
                return;

            this._setValue(this._getValue() - stepDown, useQuietMillis);
        }
    });
})(jQuery);