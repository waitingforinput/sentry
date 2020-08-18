import React from 'react';

import {t} from 'app/locale';
import EmptyStateWarning from 'app/components/emptyStateWarning';
import {Panel} from 'app/components/panels';

type Props = {
  message?: string;
};

const EmptyState = ({message}: Props) => (
  <Panel>
    <EmptyStateWarning small>
      {message ??
        t(
          'No related events have been found 12 hours either before and after the occurrence of this event.'
        )}
    </EmptyStateWarning>
  </Panel>
);

export default EmptyState;
