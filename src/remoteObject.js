import logger from './logger';
import randomWords from 'random-words';
import updateRemoteObject from './remoteObjectMethods/update';
import createRemoteObject from './remoteObjectMethods/create';
import getRemoteObjectValue from './remoteObjectMethods/get';
import retrieveRemoteObject from './remoteObjectMethods/retrieve';

class remoteObject {
  constructor(predefinedObject = {}, { sfObjectType, shorthandName, definedFields = [] }) {
    logger.logDebug(`remoteObject:${shorthandName} constructor called`);

    this._sfObjectType = sfObjectType;
    this._definedFields = definedFields;
    this._values = {};

    if (shorthandName) {
      this._shorthandName = shorthandName;
    }

    if (predefinedObject) {
      this._predefinedObject = predefinedObject;
    }

    this._definedFields.map(field => {
      if (field !== 'Id') {
        this._values[field] = `${randomWords()} ${randomWords()}`;
      }
    });
    Object.keys(this._predefinedObject).map(field => (this._values[field] = this._predefinedObject[field]));
    console.log(this);
  }

  retrieve(query, callback) {
    return retrieveRemoteObject(query, callback, this);
  }

  get(fieldToRetrieve) {
    return getRemoteObjectValue(fieldToRetrieve, this);
  }

  create(argOne, argTwo) {
    return createRemoteObject(argOne, argTwo, this);
  }

  update(argOne, argTwo) {
    return updateRemoteObject(argOne, argTwo, this);
  }
}

export default remoteObject;
