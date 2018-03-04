import logger from './logger';
import randomWords from 'random-words';
import { createObjectId, removeCustomFields } from './helpers';

class remoteObject {
  constructor(predefinedObject = {}, sfObjectType, controllerName, definedFields = []) {
    logger.logInfo(`remoteObject:${controllerName} constructor called`);

    this._controllerName = controllerName;
    this._sfObjectType = sfObjectType;
    this._definedFields = definedFields;

    definedFields.map(field => {
      if (field !== 'Id') {
        this[field] = `${randomWords()} ${randomWords()}`;
      }
    });
    Object.keys(predefinedObject).map(field => (this[field] = predefinedObject[field]));
  }

  retrieve({ limit = 5, where }, cb) {
    logger.logInfo(`retrieving ${limit} fake records from ${this._controllerName}`);

    if (where) {
      logger.logInfo(`${this._controllerName}.retrieve called with query: ${JSON.stringify(where, null, 2)}`);
    }

    if (limit > 100) {
      logger.logError('Salesforce only allows retrieving 100 records at a time from remote objects. You should correct this before deploying!');
    }

    let fakeResults = [];
    for (let i = 0; i < limit; i++) {
      fakeResults[i] = new remoteObject(
        {
          Id: createObjectId()
        },
        this._sfObjectType,
        this._controllerName,
        this._definedFields
      );
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

  create(argOne, argTwo) {
    if (!argOne && !argTwo) {
      logger.logInfo(`Inserting ${this._sfObjectType} record in to Salesforce without callback:\n${JSON.stringify(removeCustomFields(this), null, 2)}`);
      this.Id = createObjectId();
    }
    if (typeof argOne === 'function') {
      logger.logInfo(`Inserting ${this._sfObjectType} record in to Salesforce with callback:\n${JSON.stringify(removeCustomFields(this), null, 2)}`);
      this.Id = createObjectId();
      return argOne();
    }
    if (argOne && argTwo) {
      if (argOne.Id) {
        logger.logError(`Inserting ${this._sfObjectType} record failed. Cannot have Id field when creating record`);
      }
      logger.logInfo(`Inserting ${this._sfObjectType} record in to Salesforce with callback: ${JSON.stringify(argOne, null, 2)}`);
      this.Id = createObjectId();
      return argTwo();
    }
    logger.logError(`Inserting ${this._sfObjectType} record failed. First argument must either be a function or an object, second argument can only be a function`);
  }

  update(argOne, argTwo) {
    if (!argOne && !argTwo) {
      if (!this.Id || this.Id === '') {
        logger.logError(`Updating ${this._sfObjectType} record failed. Id must be specified.`);
      }
      logger.logInfo(`Updating ${this._sfObjectType} record in to Salesforce without callback:\n${JSON.stringify(removeCustomFields(this), null, 2)}`);
    }
    if (typeof argOne === 'function') {
      if (!this.Id || this.Id === '') {
        logger.logError(`Updating ${this._sfObjectType} record failed. Id must be specified.`);
      }
      logger.logInfo(`Updating ${this._sfObjectType} record in to Salesforce with callback:\n${JSON.stringify(removeCustomFields(this), null, 2)}`);
      return argOne();
    }
    if (argOne && argTwo) {
      if (!argOne.Id || argOne.Id === '') {
        logger.logError(`Updating ${this._sfObjectType} record failed. Id must be specified.`);
      }
      logger.logInfo(`Updating ${this._sfObjectType} record in to Salesforce with callback: ${JSON.stringify(argOne, null, 2)}`);
      return argTwo();
    }
    logger.logError(`Updating ${this._sfObjectType} record failed. First argument must either be a function or an object, second argument can only be a function`);
  }
}

export default remoteObject;
