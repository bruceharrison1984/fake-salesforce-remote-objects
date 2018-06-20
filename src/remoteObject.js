import logger from './logger';
import randomWords from 'random-words';
import updateRemoteObject from './remoteObjectMethods/update';
import createRemoteObject from './remoteObjectMethods/create';
import getRemoteObjectValue from './remoteObjectMethods/get';
import setRemoteObjectValue from './remoteObjectMethods/set';
import retrieveRemoteObject from './remoteObjectMethods/retrieve';

class remoteObject {
  constructor(predefinedObject = {}, {
    sfObjectType,
    shorthandName,
    definedFields = []
  }) {
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
  }

  retrieve(query, callback) {
    return this._delay().then(retrieveRemoteObject(query, callback, this));
  }

  create(argOne, argTwo) {
    return this._delay().then(createRemoteObject(argOne, argTwo, this));
  }

  update(argOne, argTwo) {
    return this._delay().then(updateRemoteObject(argOne, argTwo, this));
  }

  get(fieldToRetrieve) {
    return getRemoteObjectValue(fieldToRetrieve, this);
  }

  set(fieldToSet, value) {
    return setRemoteObjectValue(fieldToSet, value, this);
  }

  _delay() {
    return new Promise(resolve => setTimeout(resolve, window.fakeRemoteConfig.requestDelay));
  }
}

export default remoteObject;
