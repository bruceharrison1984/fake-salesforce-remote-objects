import logger from '../logger';

export default function get(fieldToRetrieve, remoteObject) {
  let _remoteObject = remoteObject;
  if (_remoteObject[fieldToRetrieve] === undefined) {
    logger.logError(`"${_remoteObject._sfObjectType}.${fieldToRetrieve}" is not defined in apex:remoteObjectModel. You should correct _remoteObject before deployment!`);
    return `"${_remoteObject._sfObjectType}.${fieldToRetrieve}" is not defined in apex:remoteObjectModel.`;
  }

  logger.logDebug(`"${_remoteObject._sfObjectType}" called with "get(${fieldToRetrieve})" return "${_remoteObject[fieldToRetrieve]}"`);
  return _remoteObject[fieldToRetrieve];
}
