import React from 'react';
import {Location} from 'history';
import uniqBy from 'lodash/uniqBy';
import moment from 'moment-timezone';

import {t} from 'app/locale';
import {Organization, Event} from 'app/types';
import EventView from 'app/utils/discover/eventView';
import DiscoverQuery from 'app/utils/discover/discoverQuery';
import LoadingIndicator from 'app/components/loadingIndicator';
import EventDataSection from 'app/components/events/eventDataSection';
import {ALL_ACCESS_PROJECTS} from 'app/constants/globalSelectionHeader';
import {getTraceDateTimeRange} from 'app/components/events/interfaces/spans/utils';

import RelatedEvents from './relatedEvents';
import EmptyState from './relatedEvents/emptyState';
import {getCurrentLocation} from './relatedEvents/utils';
import getDiscoverButton from './relatedEvents/getDiscoverButton';

type Props = {
  location: Location;
  event: Event;
  organization: Organization;
};

const EventRelatedEvents = ({event, organization, location}: Props) => {
  const orgFeatures = organization.features;

  const getEventView = () => {
    const traceID = event.contexts?.trace?.trace_id;

    if (!traceID) {
      return undefined;
    }

    const dateCreated = moment(event.dateCreated).valueOf() / 1000;
    const pointInTime = event.dateReceived
      ? moment(event.dateReceived).valueOf() / 1000
      : dateCreated;

    const {start, end} = getTraceDateTimeRange({
      start: pointInTime,
      end: pointInTime,
    });

    return EventView.fromSavedQuery({
      id: undefined,
      name: `Events with Trace ID ${traceID}`,
      fields: [
        'title',
        'event.type',
        'project',
        'project.id',
        'trace.span',
        'timestamp',
        'lastSeen',
        'issue',
      ],
      orderby: '-timestamp',
      query: `trace:${traceID}`,
      projects: orgFeatures.includes('global-views')
        ? [ALL_ACCESS_PROJECTS]
        : [Number(event.projectID)],
      version: 2,
      start,
      end,
    });
  };

  const renderEmptyState = (message?: string) => <EmptyState message={message} />;

  const eventView = getEventView();
  const currentLocation = getCurrentLocation();
  const orgSlug = organization.slug;

  return (
    <EventDataSection
      type="related-events"
      title={t('Related Events')}
      actions={getDiscoverButton({orgSlug, currentLocation, orgFeatures, eventView})}
    >
      {eventView ? (
        <DiscoverQuery location={location} eventView={eventView} orgSlug={orgSlug}>
          {discoverData => {
            if (discoverData.isLoading) {
              return <LoadingIndicator />;
            }

            if (!discoverData.tableData?.data) {
              return renderEmptyState(
                t("Sorry, but it seems that you don't have access to discover")
              );
            }

            const relatedEvents = uniqBy(discoverData.tableData?.data, 'id').filter(
              evt => evt.id !== event.id
            );

            if (!relatedEvents.length) {
              return renderEmptyState();
            }

            return (
              <RelatedEvents
                relatedEvents={relatedEvents}
                eventView={eventView}
                currentLocation={currentLocation}
                organization={organization}
                location={location}
              />
            );
          }}
        </DiscoverQuery>
      ) : (
        renderEmptyState()
      )}
    </EventDataSection>
  );
};

export default EventRelatedEvents;
