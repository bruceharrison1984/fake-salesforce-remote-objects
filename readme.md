# fake-salesforce-remote-objects
The purpose of this package is to make it easier to development Visualforce pages that make use of Salesforce Remote Objects. This shouldn't be confused with RemoteActions. 

If you are using RemoteActions, this package will not help you at all.

# installation
```
npm install fake-salesforce-remote-objects
```

# usage
To use this package, simply make a reference to the index.js script  in the HEAD of your page:
```
<script src="../node_modules/fake-salesforce-remote-objects/index.js"></script>
```
Upon page load, the script will run and attach a remote object manager to the window under the namespace you defined
