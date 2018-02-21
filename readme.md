# fake-salesforce-remote-objects
**If you are using @RemoteActions, this package will not help you at all!**

The purpose of this package is to make it easier to development Visualforce pages that make use of Salesforce Remote Objects. It is somewhat opinionated in how it expects apex DOM elements to be declared.

- Only one jsNamespace is allowed for all `apex:remoteObject` elements
  - More than one namespace will result in an error
- `apex:remoteObjectModel` should have their fields declared in the fields attribute, not in individual `apex:remoteObjectField`
- `apex:remoteObjectField` are totally ignored, so if you use these you will need to refactor to us the `field` attribute of apex:remoteObjectModel
  - This was an intentional omission since I believe your field names shouldn't change between Salesforce and your frontend

## installation
``` sh
npm install fake-salesforce-remote-objects
```

## usage
To use this package, simply make a reference to the index.js script  in the HEAD of your page:
``` html
<script src="../../node_modules/fake-salesforce-remote-objects/index.js"></script>
```

or if you are using Webpack or some other bundler, just reference the package in your entrypoint:
``` javascript
import 'fake-salesforce-remote-objects';
```

Upon page load, the script will run and attach a remote object manager to the window under the namespace you defined. Declaring the following object:
``` html
  <apex:remoteObjects jsNamespace="sfRemoteObjects">
    <apex:remoteObjectModel name="Contact" jsShorthand="jsContact" fields="Id, Name"></apex:remoteObjectModel>
  </apex:remoteObjects>

  <apex:remoteObjects jsNamespace="sfRemoteObjects">
    <apex:remoteObjectModel name="Account" jsShorthand="jsAccount" fields="Id, Address"></apex:remoteObjectModel>
  </apex:remoteObjects>
```
Contacts can be accessed by calling:
``` javascript
    getContacts() {
      const contactController = sfRemoteObjects.jsContact({ Id: 'test' });
      contactController.retrieve({ limit: 101 }, (err, contacts) => {
      console.log(contacts);
        for (let i = 0; i < contacts.length; i++) {
          console.log(contacts[i].get("Id"));
        }
      });
    }
```

**This library should not be used in a page deployed to Salesforce. It will detect that the page is in a deployed environment, throw an error, and then exit. The page will continue to run normally, but an error will be displayed in the console.**

## Object Names
Object names are derived in the following ways:
- The root remote manager is determined by what you set your `jsNamespace` attribute to in your root `apex:remoteObjects` DOM elements
  - Currently, only one namespace is allowed, more than one will intentionally throw an error
- The `jsShorthand` name for `apex:remoteObjectModel` can be explicitly defined in the DOM element, or it is automatically derived from the `name` attribute
  - Automatically derived shorthand names are simply `js prefixed to the name` attribute (Contact -> jsContact)

## Object functions
- get
  - If the value was initialized during construction (`sfRemoteObject.jsContact({ someField: 'test'})`), it will be echo'd upon get
  - If the value was not initalized, it will return an empty string ('')
  - If the field *was not* declared in the apex:remoteObjectModel DOM element, an error message will be printed in the console but your code will still be allowed to run. The return value will also make note of this error.
