# fake-salesforce-remote-objects
The purpose of this package is to make it easier to development Visualforce pages that make use of Salesforce Remote Objects. This shouldn't be confused with RemoteActions. 

If you are using RemoteActions, this package will not help you at all.

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
```
It can be invoked by calling:
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
