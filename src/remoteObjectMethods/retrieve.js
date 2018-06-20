import logger from '../logger';
import {
  createObjectId
} from '../helpers';
import RemoteObject from '../remoteObject';

export default function retrieve({
  limit = 5,
  where
}, callback, remoteObject) {
  let _remoteObject = remoteObject;
  logger.logInfo(`Retrieving ${limit} fake ${_remoteObject._sfObjectType} record(s)`);

  if (where) {
    logger.logInfo(`${_remoteObject._sfObjectType}.retrieve called with query: ${JSON.stringify(where, null, 2)}`);
  }

  if (limit > 100) {
    logger.logError('Salesforce only allows retrieving 100 records at a time from remote objects. You should correct _remoteObject before deploying!');
  }

  let fakeResults = [];
  for (let i = 0; i < limit; i++) {
    fakeResults[i] = new RemoteObject({
      Id: createObjectId()
    }, {
      sfObjectType: _remoteObject._sfObjectType,
      shorthandName: _remoteObject._shorthandName,
      definedFields: _remoteObject._definedFields
    });
  }
  if (window.fakeRemoteConfig.errors.retrieve) {
    return callback('Forced error on retrieve', fakeResults);
  }
  return callback(null, fakeResults);
}
