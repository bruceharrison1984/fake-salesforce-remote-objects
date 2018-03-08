import logger from '../logger';
import { hasCallback, removeCustomFields } from '../helpers';

export default function updateRemoteObject(argOne, argTwo, remoteObject) {
  let _remoteObject = remoteObject;
  switch (hasCallback(argOne, argTwo)) {
    case 'NoCallback': return noCallback(_remoteObject);
    case 'CallbackWithoutValues': return callbackWithoutValues(argOne, _remoteObject);
    case 'CallbackWithValues': return callbackWithValues(argOne, argTwo, _remoteObject);
    case 'Error': return error(_remoteObject);
  }
}

function noCallback(_remoteObject) {
  if (!_remoteObject._values['Id'] || _remoteObject._values['Id'] === '') {
    logger.logError(`Updating ${_remoteObject._sfObjectType} record failed. Id must be specified.`);
  }
  logger.logInfo(`Updating ${_remoteObject._sfObjectType} record in to Salesforce without callback:\n${JSON.stringify(removeCustomFields(_remoteObject), null, 2)}`);
}

function callbackWithoutValues(callback, _remoteObject) {
  if (!_remoteObject._values['Id'] || _remoteObject._values['Id'] === '') {
    logger.logError(`Updating ${_remoteObject._sfObjectType} record failed. Id must be specified.`);
  }
  logger.logInfo(`Updating ${_remoteObject._sfObjectType} record in to Salesforce with callback:\n${JSON.stringify(removeCustomFields(_remoteObject), null, 2)}`);
  return callback();
}

function callbackWithValues(values, callback, _remoteObject) {
  if (!values.Id || values.Id === '') {
    logger.logError(`Updating ${_remoteObject._sfObjectType} record failed. Id must be specified.`);
  }
  logger.logInfo(`Updating ${_remoteObject._sfObjectType} record in to Salesforce with callback: ${JSON.stringify(values, null, 2)}`);
  return callback();
}

function error(_remoteObject) {
  logger.logError(`Updating ${_remoteObject._sfObjectType} record failed. First argument must either be a function or an object, second argument can only be a function`);
  return _remoteObject;
}
