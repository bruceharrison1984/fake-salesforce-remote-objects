import logger from '../logger';
import { hasCallback, removeCustomFields } from '../helpers';

export default function updateRemoteObject(argOne, argTwo, remoteObject) {
  let _remoteObject = remoteObject;
  switch (hasCallback(argOne, argTwo)) {
    case ('NoCallback'): {
      if (!_remoteObject.Id || _remoteObject.Id === '') {
        logger.logError(`Updating ${_remoteObject._sfObjectType} record failed. Id must be specified.`);
      }
      logger.logInfo(`Updating ${_remoteObject._sfObjectType} record in to Salesforce without callback:\n${JSON.stringify(removeCustomFields(_remoteObject), null, 2)}`);
      return _remoteObject;
    }
    case ('CallbackWithoutValues'):{
      if (!_remoteObject.Id || _remoteObject.Id === '') {
        logger.logError(`Updating ${_remoteObject._sfObjectType} record failed. Id must be specified.`);
      }
      logger.logInfo(`Updating ${_remoteObject._sfObjectType} record in to Salesforce with callback:\n${JSON.stringify(removeCustomFields(_remoteObject), null, 2)}`);
      return argOne();
    }
    case ('CallbackWithValues'):{
      if (!argOne.Id || argOne.Id === '') {
        logger.logError(`Updating ${_remoteObject._sfObjectType} record failed. Id must be specified.`);
      }
      logger.logInfo(`Updating ${_remoteObject._sfObjectType} record in to Salesforce with callback: ${JSON.stringify(argOne, null, 2)}`);
      return argTwo();
    }
    case('Error'): {
      logger.logError(`Updating ${_remoteObject._sfObjectType} record failed. First argument must either be a function or an object, second argument can only be a function`);
      return _remoteObject;
    }
  }
}
