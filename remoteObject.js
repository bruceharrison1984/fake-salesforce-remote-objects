import logger from './logger';
import randomWords from 'random-words';
import uuid from 'uuid/v4';

class remoteObject {
  constructor(predefinedObject = {}, sfObjectType, controllerName, definedFields = []) {
    logger.logInfo(`remoteObject:${controllerName} constructor called`);

    this._controllerName = controllerName;
    this._sfObjectType = sfObjectType;
    this._definedFields = definedFields;

    definedFields.map(field => {
      if (field !== 'Id') {
        this[field] = `${randomWords()} ${randomWords()}`;
      } else {
        this[field] = uuid().split('-').slice(0,3).join('');
      }
    });
    Object.keys(predefinedObject).map(field => (this[field] = predefinedObject[field]));
  }

  retrieve({ limit = 5 }, cb) {
    if (limit > 100) {
      logger.logError('Salesforce only allows retrieving 100 records at a time from remote objects. You should correct this before deploying!');
    }
    logger.logInfo(`retrieving ${limit} fake records from ${this._controllerName}`);

    let fakeResults = [];
    for (let i = 0; i < limit; i++) {
      fakeResults[i] = new remoteObject({}, this._sfObjectType, this._controllerName, this._definedFields);
    }
    return cb(null, fakeResults);
  }

  get(fieldToRetrieve) {
    if (this[fieldToRetrieve] === undefined) {
      logger.logError(`"${this._sfObjectType}.${fieldToRetrieve}" is not defined in apex:remoteObjectModel. You should correct this before deployment!`);
      return `"${this._sfObjectType}.${fieldToRetrieve}" is not defined in apex:remoteObjectModel.`;
    }

    logger.logInfo(`"${this._sfObjectType}" called with "get(${fieldToRetrieve})" return "${this[fieldToRetrieve]}"`);
    return this[fieldToRetrieve];
  }

  create() {
    logger.logError('Not implemented');
  }
}

export default remoteObject;
