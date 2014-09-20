(function($) {
	var dateFormat = (function() {
		var constant = {
			Y : "Y",
			M : "M",
			D : "D",
			h : "h",
			m : "m",
			s : "s",
			date : "DATE",
			time : "TIME",
			dateTimeDelimiter : " ",
			twelveTimeSystem : "12-Hour",
			twentyFourTimeSystem : "24-Hour",

			dateTimeFormat : "DATE TIME",
			defaultDateFormatFromServer : "YYYYMMDD",
			defaultDateFormatInClient : "DD/MM/YYYY",
			defaultTimeFormatFromServer : "hhmmss",
			defaultTimeFormatInClient : "hh:mm:ss",
			defaultTimeSystem : "24-Hour",

			errors : {
				dateConvertError : "dateConvertError",
				dateConvertorArgumentsError : "dateConvertorArgumentsError",
				dateParseError : "dateParseError",

				yearError : "yearError",
				monthError : "monthError",
				dayError : "dayError",

				timeConvertError : "timeConvertError",
				timeConvertorArgumentsError : "timeConvertorArgumentsError",
				timeParseError : "timeParseError",

				hourError : "hourError",
				minuteError : "minuteError",
				secondError : "secondError"
			}
		};
		var dateObject = null;
		var timeObject = null;
		var errorObject = null;
		var errorTemplate = {
			key : "",
			message : ""
		};

		var setDateObject = function(year, month, day) {
			dateObject = {
				year : year,
				month : month,
				day : day
			};
		};
		var clearDateObject = function() {
			dateObject = null;
		};
		var getDateObject = function() {
			return dateObject;
		};

		var setTimeObject = function(hour, minute, second) {
			timeObject = {
				hour : hour,
				minute : minute,
				second : second
			};
		};
		var clearTimeObject = function() {
			timeObject = null;
		};
		var getTimeObject = function() {
			return timeObject;
		};

		var addErrorMsg = function(error) {
			if (errorObject == null) {
				errorObject = [];
			} else {
				errorObject.push({
					key : error,
					value : constant.errors[error]
				});
			}
		};
		return new function() {
			this.formatForClient = function(value, dateTimeWrapper, dateTimeDelimiter, dateFromFormat, dateToFromat, timeFromFormat, timeToFormat, timeWrapper) {
				dateTimeDelimiter = (dateTimeDelimiter == undefined) ? constant.dateTimeDelimiter : dateTimeDelimiter;
				dateFromFormat = (dateFromFormat == undefined) ? constant.defaultDateFormatFromServer : dateFromFormat;
				dateToFromat = (dateToFromat == undefined) ? constant.defaultDateFormatInClient : dateToFromat;
				timeFromFormat = (timeFromFormat == undefined) ? constant.defaultTimeFormatFromServer : timeFromFormat;
				timeToFormat = (timeToFormat == undefined) ? constant.defaultTimeFormatToServer : timeToFormat;

				var dateTime = value.split(dateTimeDelimiter);
				var date = dateTime[0];
				var time = dateTime[1];
				var formatedDate = this.dateConvertor(date, dateFromFormat, dateToFromat);
				var formatedtime = this.timeConvertor(time, timeFromFormat, timeToFormat);
				if (dateTimeWrapper != undefined) {
					return dateTimeWrapper(formatedDate, formatedtime);
				} else {
					return formatedDate + dateTimeDelimiter + formatedtime;
				}
			};
			this.formatForServer = function(value, dateTimeWrapper, dateTimeDelimiter, dateFromFormat, dateToFromat, timeFromFormat, timeToFormat, timeWrapper) {
				dateTimeDelimiter = (dateTimeDelimiter == undefined) ? constant.dateTimeDelimiter : dateTimeDelimiter;
				dateFromFormat = (dateFromFormat == undefined) ? constant.defaultDateFormatInClient : dateFromFormat;
				dateToFromat = (dateToFromat == undefined) ? constant.defaultDateFormatFromServer : dateToFromat;
				timeFromFormat = (timeFromFormat == undefined) ? constant.defaultTimeFormatToServer : timeFromFormat;
				timeToFormat = (timeToFormat == undefined) ? constant.defaultTimeFormatFromServer : timeToFormat;

				var dateTime = value.split(dateTimeDelimiter);
				var date = dateTime[0];
				var time = dateTime[1];
				var formatedDate = this.dateConvertor(date, dateFromFormat, dateToFromat);
				var formatedtime = this.timeConvertor(time, timeFromFormat, timeToFormat);
				if (dateTimeWrapper != undefined) {
					return dateTimeWrapper(formatedDate, formatedtime);
				} else {
					return formatedDate + dateTimeDelimiter + formatedtime;
				}
			};
			// date convert tools
			this.dateConvert = function(value, fromFormat, toFormat) {
				fromFormat = (fromFormat == undefined) ? constant.defaultDateFormatFromServer : fromFormat;
				toFormat = (toFormat == undefined) ? constant.defaultDateFormatInClient : toFormat;
				var date = this.dateConvertor(value, fromFormat, toFormat);
				clearDateObject();
				return date;
			};
			this.dateConvertForClient = function(value) {
				var date = this.dateConvertor(value, constant.defaultDateFormatFromServer, constant.defaultDateFormatInClient);
				clearDateObject();
				return date;
			};
			this.dateConvertForServer = function(value) {
				var date = this.dateConvertor(value, constant.defaultDateFormatInClient, constant.defaultDateFormatFromServer);
				clearDateObject();
				return date;
			};
			this.dateConvertor = function(value, fromFormat, toFormat) {
				if (this.dateConvertorValidation(value, fromFormat, toFormat)) {
					if (this.validateDate(value, fromFormat)) {
						return this.convertDate(toFormat);
					}
				}
			};
			this.dateConvertorValidation = function(value, fromFormat, toFormat) {
				if (value == undefined || fromFormat == undefined || toFormat == undefined) {
					addErrorMsg("dateConvertorArgumentsError");
					return false;
				}
				return true;
			};
			this.validateDate = function(value, fromFormat) {
				var date = this.getDate(value, fromFormat);
				if(date == null){
					return false;
				}
				var year = date.year;
				var month = date.month;
				var day = date.day;

				if (this.validateYear(year) && this.validateMonth(month) && this.validateDay(day)) {
					if (this.parseDate(year, month, day)) {
						setDateObject(year - 0, month - 0, day - 0);
						return true;
					} else {
						addErrorMsg("dateConvertError");
					}
				}
				return false;
			};
			this.getDate = function(value, fromFormat, key) {
				return this.dateTimeParser(value, fromFormat, "date", key);
			};
			this.validateYear = function(year) {
				if (year.length == 4) {
					if (isNaN(year - 0)) {
						addErrorMsg("yearError");
						return false;
					}
					if (year - 0 < 0) {
						addErrorMsg("yearError");
						return false;
					}
					return true;
				} else {
					addErrorMsg("yearError");
					return false;
				}
			};
			this.validateMonth = function(month) {
				if (month.length == 2 || month.length == 1) {
					if (isNaN(month - 0)) {
						addErrorMsg("monthError");
						return false;
					}
					if (month - 0 > 12 || month - 0 <= 0) {
						addErrorMsg("monthError");
						return false;
					}
					return true;
				} else {
					addErrorMsg("monthError");
					return false;
				}
			};
			this.validateDay = function(day) {
				if (day.length == 2 || day.length == 1) {
					if (isNaN(day - 0)) {
						addErrorMsg("dayError");
						return false;
					}
					if (day - 0 > 31 || day - 0 <= 0) {
						addErrorMsg("dayError");
						return false;
					}
					return true;
				} else {
					addErrorMsg("dayError");
					return false;
				}
			};
			this.parseDate = function(year, month, day) {
				month = month - 1;
				var date = (new Date(year, month, day));
				var dateString = Date.parse(date);
				var compareDate = new Date(dateString);
				if (year == compareDate.getFullYear() && month == compareDate.getMonth() && day == compareDate.getDate()) {
					return true;
				} else {
					addErrorMsg("dateParseError");
					return false;
				}
			};
			this.convertDate = function(toFormat) {
				var y = constant.Y, m = constant.M, d = constant.D;
				var yearStub = toFormat.substring(toFormat.indexOf(y), toFormat.lastIndexOf(y) + 1);
				var monthStub = toFormat.substring(toFormat.indexOf(m), toFormat.lastIndexOf(m) + 1);
				var dayStub = toFormat.substring(toFormat.indexOf(d), toFormat.lastIndexOf(d) + 1);

				var date = getDateObject();
				toFormat = toFormat.replace(yearStub, date.year + "");
				if (monthStub.length == 2 && date.month < 10) {
					toFormat = toFormat.replace(monthStub, "0" + date.month);
				} else {
					toFormat = toFormat.replace(monthStub, date.month + "");
				}
				if (dayStub.length == 2 && date.day < 10) {
					toFormat = toFormat.replace(dayStub, "0" + date.day);
				} else {
					toFormat = toFormat.replace(dayStub, date.day);
				}
				return toFormat;
			};

			// time convert tools
			this.timeConvert = function(value, fromFormat, toFormat, timeSystem, timeWrapper) {
				fromFormat = (fromFormat == undefined) ? constant.defaultTimeFormatFromServer : fromFormat;
				toFormat = (toFormat == undefined) ? constant.defaultTimeFormatInClient : toFormat;
				timeSystem = (timeSystem == undefined) ? constant.defaultTimeSystem : timeSystem;
				var time = this.timeConvertor(value, fromFormat, toFormat, timeSystem, timeWrapper);
				clearDateObject();
				return time;
			};
			this.timeConvertForClient = function(value) {
				var time = this.timeConvertor(value, constant.defaultTimeFormatFromServer, constant.defaultTimeFormatInClient);
				clearTimeObject();
				return time;
			};
			this.timeConvertForServer = function(value) {
				var time = this.timeConvertor(value, constant.defaultTimeFormatInClient, constant.defaultTimeFormatFromServer);
				clearTimeObject();
				return time;
			};
			this.timeConvertor = function(value, fromFormat, toFormat, timeSystem, timeWrapper) {
				if (this.timeConvertorValidation(value, fromFormat, toFormat)) {
					if (this.validateTime(value, fromFormat)) {
						return this.convertTime(toFormat, timeSystem, timeWrapper);
					}
				}
			};
			this.timeConvertorValidation = function(value, fromFormat, toFormat) {
				if (value == undefined || fromFormat == undefined || toFormat == undefined) {
					addErrorMsg("timeConvertorArgumentsError");
					return false;
				}
				return true;
			};
			this.validateTime = function(value, fromFormat) {
				var time = this.getTime(value, fromFormat);
				if(time == null){
					return false;
				}
				var hour = time.hour;
				var minute = time.minute;
				var second = time.second;

				if (this.validateHour(hour) && this.validateMinute(minute) && this.validateSecond(second)) {
					setTimeObject(hour - 0, minute - 0, second - 0);
					return true;
				}
				return false;
			};
			this.validateHour = function(hour) {
				if (hour.length > 0 && hour.length < 3) {
					if (isNaN(hour - 0)) {
						addErrorMsg("hourError");
						return false;
					}

					if (hour - 0 < 0 || hour > 23) {
						addErrorMsg("hourError");
						return false;
					}
					return true;
				} else {
					addErrorMsg("hourError");
					return false;
				}
			};
			this.validateMinute = function(minute) {
				if (minute.length > 0 && minute.length < 61) {
					if (isNaN(minute - 0)) {
						addErrorMsg("minuteError");
						return false;
					}

					if (minute - 0 < 0 || minute > 59) {
						addErrorMsg("minuteError");
						return false;
					}
					return true;
				} else {
					addErrorMsg("minuteError");
					return false;
				}
			};
			this.validateSecond = function(second) {
				if (second.length > 0 && second.length < 61) {
					if (isNaN(second - 0)) {
						addErrorMsg("secondError");
						return false;
					}

					if (second - 0 < 0 || second > 59) {
						addErrorMsg("secondError");
						return false;
					}
					return true;
				} else {
					addErrorMsg("secondError");
					return false;
				}
			};
			this.convertTime = function(toFormat, timeSystem, timeWrapper) {
				var hourStub = toFormat.substring(toFormat.indexOf(constant.h), toFormat.lastIndexOf(constant.h) + 1);
				var minuteStub = toFormat.substring(toFormat.indexOf(constant.m), toFormat.lastIndexOf(constant.m) + 1);
				var secondStub = toFormat.substring(toFormat.indexOf(constant.s), toFormat.lastIndexOf(constant.s) + 1);

				var time = getTimeObject();
				if (timeSystem == constant.twelveTimeSystem) {
					if (hourStub.length == 2) {
						if ((time.hour > 12) && time.hour - 12 < 10) {
							toFormat = toFormat.replace(hourStub, "0" + ((time.hour > 12) ? time.hour - 12 : time.hour) + "");
						} else {
							toFormat = toFormat.replace(hourStub, ((time.hour > 12) ? time.hour - 12 : time.hour) + "");
						}
					} else {
						toFormat = toFormat.replace(hourStub, ((time.hour > 12) ? time.hour - 12 : time.hour) + "");
					}
				} else if (timeSystem == constant.twentyFourTimeSystem) {
					if (hourStub.length == 2 && time.hour < 10) {
						toFormat = toFormat.replace(hourStub, "0" + time.hour + "");
					} else {
						toFormat = toFormat.replace(hourStub, time.hour + "");
					}
				}
				if (minuteStub.length == 2 && time.minute < 10) {
					toFormat = toFormat.replace(minuteStub, "0" + time.minute + "");
				} else {
					toFormat = toFormat.replace(minuteStub, time.minute + "");
				}
				if (secondStub.length == 2 && time.minute < 10) {
					toFormat = toFormat.replace(secondStub, "0" + time.second + "");
				} else {
					toFormat = toFormat.replace(secondStub, time.second + "");
				}
				if (timeWrapper != undefined) {
					return timeWrapper(toFormat);
				} else {
					return toFormat;
				}
			};
			this.getTime = function(value, fromFormat, key) {
				return this.dateTimeParser(value, fromFormat, "time", key);
			};
			
			this.dateTimeParser = function(value, fromFormat, type, key) {
				var firstChar = fromFormat.charAt(0);
				var midChar;
				var lastChar = fromFormat.charAt(fromFormat.length - 1);

				if (type == "date") {
					midChar = (constant.Y + constant.M + constant.D).replace(firstChar, "").replace(lastChar, "");
				} else if (type == "time") {
					midChar = (constant.h + constant.m + constant.s).replace(firstChar, "").replace(lastChar, "");
				} else {
					return null;
				}

				var chars = [ firstChar, midChar, lastChar ], d = value;
				var firstDelimiter, secondDelimiter, start, end;
				var stub, stubArr = [], datetime = {};

				start = fromFormat.lastIndexOf(firstChar) + 1;
				end = fromFormat.indexOf(midChar);
				firstDelimiter = fromFormat.substring(start, end);

				start = fromFormat.lastIndexOf(midChar) + 1;
				end = fromFormat.indexOf(lastChar);
				secondDelimiter = fromFormat.substring(start, end);

				stub = d.substring(0, d.indexOf(firstDelimiter[0]));
				stubArr.push(stub);
				d = d.replace(stub + firstDelimiter, "");
				stub = d.substring(0, d.lastIndexOf(secondDelimiter[0]));
				stubArr.push(stub);
				d = d.replace(stub + secondDelimiter, "");
				stubArr.push(d);

				for (var i = 0; i < chars.length; i++) {
					this.populateDateTime(chars[i], datetime, stubArr[i]);
				}
				if (key != undefined) {
					return datetime[key];
				}else{
					return datetime;
				}
			};
			this.populateDateTime = function(type, datetime, value) {
				switch (type) {
				case constant.Y:
					datetime.year = value;
					break;
				case constant.M:
					datetime.month = value;
					break;
				case constant.D:
					datetime.day = value;
					break;
				case constant.h:
					datetime.hour = value;
					break;
				case constant.m:
					datetime.minute = value;
					break;
				case constant.s:
					datetime.second = value;
					break;
				default:
					break;
				}
			};
			// error process
			this.errorProcessor = function(error) {
				switch (error) {
				default:
					break;
				}
			};
		};
	})();
})(jQuery);
