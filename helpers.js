export function getJsNamespace() {
  const remoteObjectNodes = document.getElementsByTagName('apex:remoteObjects');
  if (remoteObjectNodes.length) {
    return;
  }
  const jsNamespaceArray = Array.from(remoteObjectNodes, element => element.getAttribute('jsNamespace'));
  if (jsNamespaceArray.length !== remoteObjectNodes.length) {
    throw new Error('You have apex:remoteobjects DOM elements that do not have jsNamespace attributes. Add them to remove this error.')
  }
  const uniqueNamespaces = jsNamespaceArray.filter(getUniqueValues);
  if (uniqueNamespaces.length > 1) {
    throw new Error(`More than one namespace defined by apex:remoteobjects - ${uniqueNamespaces.filter(getDuplicateValues).join(';')}`);
  }
  return uniqueNamespaces[0];
}

export function getRemoteObjectModel() {
  const remoteObjectModelNodes = document.getElementsByTagName('apex:remoteobjectmodel');
  const jsObjectModelArray = Array.from(remoteObjectModelNodes, element => {
    return {
      name: element.getAttribute('name'),
      jsshorthand: element.getAttribute('jsshorthand') || element.getAttribute('name'),
      fields: element.getAttribute('fields').split(',')
    };
  });
  const jsShorthandNames = jsObjectModelArray.map(x => x.jsshorthand.trim());
  if (jsShorthandNames.filter(getUniqueValues).length < jsObjectModelArray.length) {
    throw new Error(`JsShorthand name used more than once: ${jsShorthandNames.filter(getDuplicateValues).join(';')}`);
  }
  return jsObjectModelArray;
}

export function getUniqueValues(value, index, self) {
  return self.indexOf(value) === index;
}

export function getDuplicateValues(value, index, self) {
  return self.indexOf(value) !== index;
}
