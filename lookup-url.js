/**
* Loads URL lookup dictionary from a named file.
*/
function loadUrls(path) {
   let fs = require('fs');
   const text = fs.readFileSync(path).toString('utf-8');
   const lines = text.split(/\r\n|\n/);
   const lookup = {}

   for (var line of lines) {
       line = line.trim();
       if (line.length == 0 || line.startsWith('#')) { 
           continue;                           // Ignore blank and comment lines
       }
       line = line.split('#', 1)[0].trim();    // Strip trailing comments
       let items = line.split(/\s+/);          // Split into component parts
       if (items.length != 2) {
           console.log("Bad line: " + line);
           continue;
       }
       lookup[items[0]] = items[1];            // URL is indexed by phone number
   }

   return lookup
}


/**
* Returns error response.
*/
function errorResponse(code, message, callback) {
   const response = new Twilio.Response();
   response.setBody(message);
   response.setStatusCode(code);
   callback(null, response);
}


/**
* Returns the redirect URL for a call to a SIP Domain.  Uses the following event parameters:
*  
* event.To         -- The To URI.
* event.Filename   -- Text file containing list of phone numbers and corresponding URLs.
*                     The file should be loaded into the account's Private Assets.
* event.DefaultURL -- If no URL found, use this one (optional).
*
* Returns 404 if no URL was found, and 500 if unable to load the lookup file.
*/
exports.handler = function(context, event, callback) {
   const response = new Twilio.twiml.VoiceResponse();
   const filename = event.Filename;
   const defaultUrl = event.DefaultUrl; 
   const expPhoneNumber = /^sip:((\+)?[0-9]+)/;    // Regex for numeric part of To URI
   const toUri = event.To;
   const matchNumber = expPhoneNumber.exec(toUri);
   const toPhone = matchNumber ? matchNumber[1] : null;

   console.log("To URI: " + toUri + "  To Phone: " + toPhone);

   if (filename) {
       let asset = Runtime.getAssets()[filename];
       if (asset) {
           const lookup = loadUrls(asset.path);
           const url = lookup[toPhone] || defaultUrl;
           if (url) {
               response.redirect(url);
               callback(null, response);
           } else {
               errorResponse(404, "No URL for " + toUri, callback);
           }
       } else {
           errorResponse(500, "Could not find " + filename, callback);
       }
   } else {
       errorResponse(500, "Missing filename", callback);
   }
};