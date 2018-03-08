import logger from '../logger';

export default function set(fieldToSet, value, remoteObject) {
  let _remoteObject = remoteObject;
  if (_remoteObject._values[fieldToSet] === undefined) {
    logger.logError(`"${_remoteObject._sfObjectType}.${fieldToSet}" is not defined in apex:remoteObjectModel. You should correct this before deployment!`);
  }
  _remoteObject._values[fieldToSet] = value;
  logger.logDebug(`"${_remoteObject._sfObjectType}.${fieldToSet}" has been set to ${value}`);
}
