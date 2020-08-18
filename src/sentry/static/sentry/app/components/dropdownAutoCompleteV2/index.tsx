import React from 'react';
import styled from '@emotion/styled';

import Menu from './menu';

type MenuProps = React.ComponentProps<typeof Menu>;

type Props = MenuProps & {
  // Should clicking the actor toggle visibility?
  allowActorToggle: boolean;
  children: () => React.ReactElement;
};

const DropdownAutoComplete = ({
  alignMenu = 'right',
  children,
  allowActorToggle,
  ...props
}: Props) => (
  <Menu {...props} alignMenu={alignMenu}>
    {renderProps => {
      // Don't pass `onClick` from `getActorProps`
      const {onClick: _onClick, ...actorProps} = renderProps.getActorProps();

      return (
        <Actor
          isOpen={renderProps.isOpen}
          role="button"
          tabIndex={0}
          onClick={
            renderProps.isOpen && allowActorToggle
              ? renderProps.actions.close
              : renderProps.actions.open
          }
          {...actorProps}
        >
          {children(renderProps)}
        </Actor>
      );
    }}
  </Menu>
);

const Actor = styled('div')<{isOpen: boolean}>`
  position: relative;
  width: 100%;
  /* This is needed to be able to cover dropdown menu so that it looks like one unit */
  ${p => p.isOpen && `z-index: ${p.theme.zIndex.dropdownAutocomplete.actor}`};
`;

export default DropdownAutoComplete;
