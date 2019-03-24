// Packages.
import * as _ from 'lodash';
import * as debug from 'debug';
import { Eratosthenes } from '@scenicroutes/eratosthenes';

// Internal.

// Code.
// const debugError = debug('cartier:error:handleAreas');
const debugVerbose = debug('cartier:verbose:handleAreas');

export const handleAreas = async (
  jobsRemaining: number
): Promise<{ jobsSent: number; jobsScheduled: number }> => {
  debugVerbose(`jobsRemaining: %j`, jobsRemaining);

  // Retrieve areas from DynamoDB
  const areasList = await Eratosthenes.AreaModel.list();

  debugVerbose(`scan response: %j`, areasList);

  if (areasList instanceof Error) {
    throw areasList;
  }

  const now = Date.now();

  const areas = _.filter(
    areasList.ok,
    area =>
      area.enabled &&
      area.zonesComputed &&
      now - area.lastScheduledAt > area.refreshRate
  );

  debugVerbose(`areas to schedule: %j`, areas);

  if (!areas.length) {
    return { jobsSent: 0, jobsScheduled: 0 };
  }

  // Updating last scheduling time on DynamoDB
  await Promise.all(
    areas.map(area => Eratosthenes.AreaModel.updateItem(area.id, now))
  );

  // Get zones from DynamoDB
  // const zones

  // Send first jobs remaining zones to job scheduler and await response

  // Send the others as jobs with page 0

  // Send the responses

  return { jobsSent: 0, jobsScheduled: 0 };
};
