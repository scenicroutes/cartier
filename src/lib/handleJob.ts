// Packages.
import * as debug from 'debug';
import { Flickr } from '@scenicroutes/davinci';
import * as Wittgenstein from '@scenicroutes/wittgenstein';

// Internal.
import Config from './Config';
import * as Types from '../types';

// Code.
const debugVerbose = debug('cartier:verbose:handleJob');

export const handleJob = async (job: Wittgenstein.Job) => {
  const searchOptions: Types.SearchOptions = {
    bbox: job.zone.bbox,
    min_upload_date: job.minUploadDate,
    max_upload_date: job.maxUploadDate,
    page: job.page,
  };

  // Inside by default, as I expect many photos to be inside bboxes (without zones)
  const photoProperties: Types.PhotoProperties = {
    zoneId: job.zone.id,
    inside: true,
  };

  debugVerbose(`querying API with %o and %o`, searchOptions, photoProperties);

  const flickrResponse = await Flickr.API.search(
    Config.flickrKey,
    searchOptions,
    photoProperties
  );

  debugVerbose(`API answered with %o`, flickrResponse);

  return flickrResponse;
};
