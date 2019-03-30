function hbsHelpers(hbs) {
    return hbs.create({
      helpers: {
        inc: function(value, options) {
          console.log('reading it');
          return parseInt(value) + 1;
        }
        // should you wish to add more handlebar functions, just add them as keyed functions.
      }
  
    });
  }
  
  module.exports = hbsHelpers;