import logger from '../logger';
import { hasCallback, createObjectId, removeCustomFields } from '../helpers';

export default function create(argOne, argTwo, remoteObject) {
  let _remoteObject = remoteObject;
  switch (hasCallback(argOne, argTwo)) {
    case ('NoCallback'): {
      logger.logInfo(`Inserting ${_remoteObject._sfObjectType} record in to Salesforce without callback:\n${JSON.stringify(removeCustomFields(_remoteObject), null, 2)}`);
      _remoteObject.Id = createObjectId();
      return _remoteObject;
    }
    case ('CallbackWithoutValues'):{
      logger.logInfo(`Inserting ${_remoteObject._sfObjectType} record in to Salesforce with callback:\n${JSON.stringify(removeCustomFields(_remoteObject), null, 2)}`);
      _remoteObject.Id = createObjectId();
      return argOne();
    }
    case ('CallbackWithValues'):{
      if (argOne.Id) {
        logger.logError(`Inserting ${_remoteObject._sfObjectType} record failed. Cannot have Id field when creating record`);
      }
      logger.logInfo(`Inserting ${_remoteObject._sfObjectType} record in to Salesforce with callback: ${JSON.stringify(argOne, null, 2)}`);
      _remoteObject.Id = createObjectId();
      return argTwo();
    }
    case('Error'): {
      logger.logError(`Inserting ${_remoteObject._sfObjectType} record failed. First argument must either be a function or an object, second argument can only be a function`);
      return _remoteObject;
    }
  }
}
