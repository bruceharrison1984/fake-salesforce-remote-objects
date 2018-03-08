# fake-salesforce-remote-objects
**If you are using @RemoteActions, this package will not help you at all!**

The purpose of this package is to make it ~~easier~~ possible to locally develop Visualforce pages that make use of Salesforce Remote Objects. It is somewhat opinionated in how it expects apex DOM elements to be declared.

- Only one jsNamespace is allowed for *all* `apex:remoteObject` elements
  - More than one namespace will result in an error
  - If you do not define a namespace, it is set to the Salesforce default of `SObjectModel`
    - For simplicity and brevity, it is easiest to not define any namespaces and use the default
- `apex:remoteObjectModel` should have their fields declared in the fields attribute, not in individual `apex:remoteObjectField`
  - Objects must have at least one field declared, otherwise an error will occur
  - Functions are automatically generated based on the Name. This is inline with the offical API
  - If a jsShortname is declared, functions will be generated for that as well
- `apex:remoteObjectField` are totally ignored, so if you use these you will need to refactor to us the `field` attribute of apex:remoteObjectModel
  - This was an intentional omission, I see no point in renaming fields in your frontend (unless you really enjoy confusion)

Since this library is a fake of the offical remote object API, promises are *not* supported OOTB(just like the real API). Unless you like callbacks, I suggest writing your own helpers to wrap these functions in promises.

- [Remote Objects Primer](https://developer.salesforce.com/docs/atlas.en-us.pages.meta/pages/pages_remote_objects.htm)
- [apex:remoteObject](https://developer.salesforce.com/docs/atlas.en-us.pages.meta/pages/pages_compref_remoteObjects.htm)
- [apex:remoteObjectModel](https://developer.salesforce.com/docs/atlas.en-us.pages.meta/pages/pages_compref_remoteObjectModel.htm)

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
  <apex:remoteObjects>
    <apex:remoteObjectModel name="Contact" jsShorthand="jsContact" fields="Id, Name"></apex:remoteObjectModel>
  </apex:remoteObjects>
```
Fake contacts can be be accessed locally in exactly the same way that they are accessed on a deployed Visualforce page:
``` javascript
    getContacts() {
      const contact = SObjectModel.jsContact();
      new contact.retrieve({ limit: 10 }, (err, contacts) => {
      console.log(contacts);
        for (let i = 0; i < contacts.length; i++) {
          console.log(contacts[i].get("Id"));
        }
        return;
      });
    }
    createContact() {
      const contact = SObjectModel.jsContact();
      new contact.create({ LastName: 'some_dude' }, (err) => {
        if(err){
          console.log(err);
          return;
        }
        console.log('Good job, you inserted a contact!');
        return;
      });
    }
```

**This library should not be used in a page deployed to Salesforce. It will detect that the page is in a deployed environment, and print a message in the console. Your page will still work properly, but don't force your users to download things they don't need.**

## Object Names
Object names are derived in the following ways:
- The root remote manager is determined by what you set your `jsNamespace` attribute to in your root `apex:remoteObjects` DOM elements
  - If you omit the jsNamespace attribute, it will be set to `SObjectModel`
  - Currently, only one namespace is allowed, more than one will intentionally throw an error
- The `jsShorthand` name for `apex:remoteObjectModel` can be explicitly defined in the DOM element
  - This is not required, but can be used if you choose
  - If not defined, call the object by the Name attribute

## Fake fields
**These fields are not part of the Salesforce spec, and they should not be referenced directly in your code.** 
### RemoteObject
These fields are added to the window level Remote Object
- `_jsNamespace`
  - The namespace that the Remote Object was assigned to via jsNamespace
- `_remoteObjectModels`
  - The available models as defined on the page through apex:remoteobjectmodel DOM elements

### RemoteObjectModel
These fields are added to any fake objects created. They simply exist to make local development easier and help you keep track of objects.
- `_sfObjectType`
  - The Salesforce Object Type declared in the apex:remoteObjectModel
- `_shorthandName`
  - The jsShorthand name
  - Field won't exist if jsShorthand wasn't used
- `_fakeCount`
  - When doing a query or retrieval, this field keeps count of the returned objects
- `_predefinedObject`
  - If you initalized the object with values, the original values will be stored here
  - Field won't exist if initialized without values
- `_values`
  - When initializing objects, values are stored here
  - This is to accurately reflect the Salesforce API, which doesn't attach properties directly to the object
    - Use the `get` method to retrieve values from this store
    - Values should never be directly accessed through this property

## Fake Object functions
This list contains the fuctions that have been **faked** from the Salesforce Remote Object API. It probably won't ever contain all of the possible functions, just the most frequently used ones. Console messages are used extensively so you can follow your API calls during development.

- `constructor({ field: 'value', field2: 'value'})`
  - Any fields passed in to the constructor will be assigned to the created object
  - Any retrievals from this object will return an array of *n* clones of this object
- `get("FieldName")`
  - If the value was initialized during construction
    - The value will be returned
  - If the value was set in code
    - The value will be returned
  - If the value was not initalized
    - It will consistently return the same random string
  - If the field *was not* defined in the apex:remoteObjectModel DOM element
    - an error message will be printed in the console but your code will still be allowed to run
    - The return value will also make note of this error.
  - Values are stored in the `_values` property on the object, but you should only access them through this method
- `retrieve({ limit: 100, where: {} }, callback(err, results))`
  - Only the callback format of this function is supported
  - Each returned object is automatically assigned an `Id` field that is populated with a random string to simulate a Salesforce Id
  - A number of objects equal to the limit passed in are returned
    - These objects are direct copies of the initalized object
    - object have a _fakeCount field attached to them for identification
    - limits > 100 will display an error message, but your code will run normally
      - Salesforce doesn't allow more than 100 results at a time
    - The where clause object will be echo'd back at you in console
      - Where clause arguments are not validated nor are results filtered based on the query
- `create(recordValues, callback)`
  - You can initialize your object with values, or supply them to the create function
  - An Id field will be created and populated on execution
- `update(recordValues, callback)`
  - You can initialize your object with values, or supply them to the create function

## Fake Data
The fake data generated by this library is **not** representative of the fields or their data types. It is simply filler data so you have something to look at while you develop.

- Any created Fake object will be assigned a unique faux Id field
  - This field in no way represents an actual Salesforce object Id, and its value should not be depended upon in your code
  - The value is not even in the Salesforce format to discourage any sort of filtering by Id
- Any fields defined in the apex:remoteobjectmodel will be assigned random values upon fake object creation
- If you pass in a predefined object, any fields supplied will `not` be overwritten
  - If you have fields you wish to remain blank, then pass them in with empty strings
- If you attempt to `get` a field that was not predefined, and is not defined in the apex:remoteobjectmodel, an error is displayed in the console
  - This isn't a fatal error, just a warning that you should add that field to your apex:remoteobjectmodel definition

- [UUID Generation Library](https://www.npmjs.com/package/uuid)
- [RandomWords Library](https://www.npmjs.com/package/random-words)

## Wish list
- Predefined data sets
  - An external file that could be used to model Salesforce objects, their fields, and potential field values
- Global configuration
  - Pass in an object to set behavior
    - Fake time delay for CRUD
    - Fake server errors

**More functions will be added as necessary, pull requests are welcome!**
