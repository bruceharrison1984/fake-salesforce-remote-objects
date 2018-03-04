import uuid from 'uuid/v4';

export function getJsNamespace() {
  const remoteObjectNodes = document.getElementsByTagName('apex:remoteObjects');
  if (!remoteObjectNodes.length) {
    return;
  }
  const jsNamespaceArray = Array.from(remoteObjectNodes, element => element.getAttribute('jsNamespace') || 'SObjectModel').filter(getUniqueValues);
  if (jsNamespaceArray.length > 1) {
    throw new Error(`More than one namespace defined by apex:remoteobjects - ${jsNamespaceArray.join(';')}\napex:remoteobjects without jsNamespace attributes are defaulted to \'SObjectModel\'`);
  }
  return jsNamespaceArray[0];
}

export function createObjectId() {
  return uuid()
    .split('-')
    .slice(0, 3)
    .join('');
}

export function removeCustomFields(obj) {
  let newObject = {};
  Object.keys(obj).filter(field => field.indexOf('_') !== 0).map(field => newObject[field] = obj[field]);
  return newObject;
}

export function getRemoteObjectModel() {
  const remoteObjectModelNodes = document.getElementsByTagName('apex:remoteobjectmodel');
  const jsObjectModelArray = Array.from(remoteObjectModelNodes, element => {
    return {
      name: element.getAttribute('name'),
      jsshorthand: element.getAttribute('jsshorthand'),
      fields: element
        .getAttribute('fields')
        .split(',')
        .filter(x => x !== '')
    };
  });
  const objectsWithNoFields = jsObjectModelArray.filter(x => x.fields.length === 0);
  if (objectsWithNoFields.length) {
    throw new Error(`apex:remoteobjectmodel doesn't have any fields defined: ${objectsWithNoFields.map(x => x.name).join(';')}`);
  }
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
