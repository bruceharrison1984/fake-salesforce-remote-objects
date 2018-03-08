import logger from '../logger';
import { hasCallback, createObjectId, removeCustomFields } from '../helpers';

export default function create(argOne, argTwo, remoteObject) {
  let _remoteObject = remoteObject;
  switch (hasCallback(argOne, argTwo)) {
    case 'NoCallback': return noCallback(_remoteObject);
    case 'CallbackWithoutValues': return callbackWithoutValues(argOne, _remoteObject);
    case 'CallbackWithValues': return callbackWithValues(argOne, argTwo, _remoteObject);
    case 'Error': return error(_remoteObject);
  }
}

function noCallback(_remoteObject) {
  logger.logInfo(`Inserting ${_remoteObject._sfObjectType} record in to Salesforce without callback:\n${JSON.stringify(removeCustomFields(_remoteObject), null, 2)}`);
  _remoteObject._values['Id'] = createObjectId();
}

function callbackWithoutValues(callback, _remoteObject) {
  if (_remoteObject._values['Id']) {
    logger.logError(`Creating ${_remoteObject._sfObjectType} record failed. Id cannot be specified.`);
  }
  logger.logInfo(`Inserting ${_remoteObject._sfObjectType} record in to Salesforce with callback:\n${JSON.stringify(removeCustomFields(_remoteObject), null, 2)}`);
  _remoteObject._values['Id'] = createObjectId();
  return callback();
}

function callbackWithValues(values, callback, _remoteObject) {
  if (values.Id) {
    logger.logError(`Inserting ${_remoteObject._sfObjectType} record failed. Cannot have Id field when creating record`);
  }
  logger.logInfo(`Inserting ${_remoteObject._sfObjectType} record in to Salesforce with callback: ${JSON.stringify(values, null, 2)}`);
  _remoteObject._values['Id'] = createObjectId();
  return callback();
}

function error(_remoteObject) {
  logger.logError(`Inserting ${_remoteObject._sfObjectType} record failed. First argument must either be a function or an object, second argument can only be a function`);
  return _remoteObject;
}
