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
    this._shorthandName = shorthandName;
    this._definedFields = definedFields;
    this._predefinedObject = predefinedObject;

    this._definedFields.map(field => {
      if (field !== 'Id') {
        this[field] = `${randomWords()} ${randomWords()}`;
      }
    });
    Object.keys(this._predefinedObject).map(field => (this[field] = this._predefinedObject[field]));
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
