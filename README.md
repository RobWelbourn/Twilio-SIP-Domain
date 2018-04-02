# Twilio-SIP-Domain
Twilio functions for handling calls from a SIP Domain

## Introduction
With Twilio phone numbers, each number has its own URL for processing voice calls.  With a Twilio SIP Domain, one URL handles the entire domain.  If you want to have granular control of how calls to each phone number within the domain are processed, you will need to write a front-end call routing function.  `lookup-url.js` is just such a function.

## Installation Instructions
Create a file containing phone numbers, one per line, with the URL that will provide the call processing instructions.  See `example.txt` for the file layout.  Notice that you can include comments by proceeding them with the '#' character.  In your Twilio console, navigate to [Runtime > Assets](https://www.twilio.com/console/runtime/assets/public) and upload the file.  Make sure you check the box for 'Private Asset', so that you can access it from your function.

Next, go to [Runtime > Functions](https://www.twilio.com/console/runtime/functions/manage) and click on the red plus sign to create a new function.  Click on the blank template and then 'Create'.  Give your function a meaningful name and set the path.  Copy and paste the contents of `lookup-url.js` into the code box and click on 'Save'.  Copy the function URL to the clipboard.

To configure the URL, go to your [SIP Domain](https://www.twilio.com/console/voice/sip/endpoints) and paste the function URL into the 'Request URL'.  You will need to add some URL parameters:

* _Filename_    -- The name of the file that you uploaded.
* _DefaultUrl_  -- (Optional) A catch-all URL if the phone number is not found in the file. (Make sure this is [URL-encoded](https://www.urlencoder.org/).)

An example URL will look like this: 

`https://dancing-owl-0381.twil.io/lookup-url?&Filename=example.txt&DefaultUrl=https%3A%2F%2Fhandler.twilio.com%2Ftwiml%2FEH19a3744765d448d011b0c2a0d144b0a3`

## Testing
You can test your new function directly, by making calls to your SIP domain, or by pointing a web browser or a tool like [Postman](https://www.getpostman.com/) at the URL.  If you are going to use a browser or Postman, make sure you uncheck the 'Check for valid Twilio signature' checkbox on the function page, otherwise you'll get a _403 Forbidden_ response.

Make sure the function web page is open when you make a test invocation, so that you can see the console logs.  If there are any errors they will be displayed in the function console.  Be sure that you include a _To_ parameter with the target SIP URI if you are using a web browser or Postman to invoke the function.  It will look something like `sip:6175551212@mytelco.sip.us1.twilio.com`.

Once you have completed testing, make sure you check the 'Check for valid Twilio signature' checkbox, for security reasons.

## In Production
If there any problems with running the function, you should check the Twilio console debugger for Notification errors, in particular 404 errors if the phone number was not found, and you didn't specify a catch-all URL.