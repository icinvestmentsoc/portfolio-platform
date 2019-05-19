function hbsHelpers(hbs) {
    return hbs.create({
      helpers: {
        inc: function(value, options) {
          console.log('reading it');
          return parseInt(value) + 1;
        },
        priceDisplay: function(value, options) {
          if (value) {
            return "$" + parseFloat(value).toFixed(2);
          }

          return ""
        },
        perDiff: function(before, after, options) {
          var percentDiff = (parseFloat(after) - parseFloat(before)) / parseFloat(before);
          if (percentDiff >= 0) {
            percentDiff = "+" + percentDiff;
          }

          percentDiff = parseFloat(percentDiff).toFixed(2) + "%";

          if (percentDiff < 0) {
            return "<span class='negative'>(" + percentDiff + ")</span>";
          } else if (percentDiff > 0) {
            return "<span class='positive'>(" + percentDiff + ")</span>";
          } else {
            return "(" + percentDiff + ")";
          }

        }
        // should you wish to add more handlebar functions, just add them as keyed functions.
      }
  
    });
  }
  
  module.exports = hbsHelpers;