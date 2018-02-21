# fake-salesforce-remote-objects
The purpose of this package is to make it easier to development Visualforce pages that make use of Salesforce Remote Objects. It is somewhat opinionated in how it expects apex DOM elements  to be declated:

- Only one jsNamespace is allowed for all `apex:remoteObject` elements
- `apex:remoteObjectModel` should have their fields declared in the fields attribute, not in individual `apex:remoteObjectField`
- `apex:remoteObjectField` are totally ignored, so if you use these you will need to refactor to us the `field` attribute of apex:remoteObjectModel
  - This was an intentional omission since I believe your field names shouldn't change between Salesforce and your frontend

This shouldn't be confused with RemoteActions. If you are using RemoteActions, this package will not help you at all.

# installation
``` sh
npm install fake-salesforce-remote-objects
```

# usage
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

## Object Names
Object names are derived in the following ways:
- The root remote manager is determined by what you set your `jsNamespace` attribute to in your root `apex:remoteObjects` DOM elements
  - Currently, only one namespace is allowed, more than one will intentionally throw an error
- The `jsShorthand` name for `apex:remoteObjectModel` can be explicitly defined in the DOM element, or it automatically derived from the `name` attribute
  - Automatically derived shorthand names are simply `js prefixed to the name` attribute  Contact -> jsContact

## Object functions
- get
  - If the value was initialized during construction (sfRemoteObject.jsObject({ someField: 'test'})), the value will be returned
  - If the value was not intentionally initalized, it will return an empty string ('')
  - If the field was not declared in the apex:remoteObjectModel DOM element, an error message will be printed in the console
