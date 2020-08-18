import React from 'react';
import styled from '@emotion/styled';

import {t} from 'app/locale';
import AutoComplete from 'app/components/autoComplete';
import DropdownBubble from 'app/components/dropdownBubble';
import Input from 'app/views/settings/components/forms/controls/input';
import LoadingIndicator from 'app/components/loadingIndicator';
import space from 'app/styles/space';

import {Items, ItemSize} from './types';
import {autoCompleteFilter} from './utils';
import List from './list';

type ListProps = React.ComponentProps<typeof List>;

type ChildrenProps = {
  getInputProps: () => void;
  getActorProps: () => {onClick: () => void};
  actions: {open: () => void; close: () => void};
  isOpen: boolean;
  selectedItem: Items[0];
};

type Props = ListProps & {
  /**
   * When an item is selected (via clicking dropdown, or keyboard navigation)
   */
  onSelect: (item: Items[0]) => void;

  children: (props: ChildrenProps) => React.ReactNode;

  menuHeader?: React.ReactNode;

  /**
   * Hide's the input when there are no items. Avoid using this when querying
   * results in an async fashion.
   */
  emptyHidesInput?: boolean;

  /**
   * Search input's placeholder text
   */
  searchPlaceholder?: string;

  /**
   * Message to display when there are no items initially
   */
  emptyMessage?: React.ReactNode;

  /**
   * Message to display when there are no items that match the search
   */
  noResultsMessage?: React.ReactNode;

  /**
   * Show loading indicator next to input and "Searching..." text in the list
   */
  busy?: boolean;

  /**
   * Dropdown menu alignment.
   */
  alignMenu?: 'left' | 'right';

  /**
   * Size for dropdown items
   */
  itemSize?: ItemSize;

  /**
   * If this is undefined, autocomplete filter will use this value instead of the
   * current value in the filter input element.
   *
   * This is useful if you need to strip characters out of the search
   */
  filterValue?: string;

  /**
   * Hides the default filter input
   */

  hideInput?: boolean;

  /**
   * Props to pass to menu component
   */
  menuProps?: any;

  /**
   * Show loading indicator next to input but don't hide list items
   */
  busyItemsStillVisible?: boolean;

  /**
   * Changes the menu style to have an arrow at the top
   */
  menuWithArrow?: boolean;

  /**
   * Used to control dropdown state
   */
  isOpen?: boolean;

  /**
   * Callback for when dropdown menu opens
   */
  onOpen?: () => void;

  /**
   * Callback for when dropdown menu closes
   */
  onClose?: () => void;

  /**
   * Props to pass to input/filter component
   */
  inputProps?: any;

  /**
   * Should menu visually lock to a direction (so we don't display a rounded corner)
   */
  blendCorner?: boolean;

  /**
   * When AutoComplete input changes
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;

  className?: string;

  /**
   * for passing simple styles to the root container
   */
  rootClassName?: string;
};

const Menu = ({
  maxHeight = 300,
  emptyMessage = t('No items'),
  searchPlaceholder = t('Filter search'),
  isOpen = false,
  blendCorner = true,
  alignMenu = 'left',
  hideInput = false,
  busy = false,
  itemSize = 'small',
  busyItemsStillVisible = false,
  menuWithArrow = false,
  virtualizedHeight,
  menuProps,
  noResultsMessage,
  inputProps,
  onSelect,
  onOpen,
  onClose,
  children,
  rootClassName,
  className,
  emptyHidesInput,
  onChange,
  menuHeader,
  filterValue,
  onScroll,
  items,
  ...props
}: Props) => (
  <AutoComplete
    itemToString={() => ''}
    onSelect={onSelect}
    inputIsActor={false}
    onOpen={onOpen}
    onClose={onClose}
    resetInputOnClose
    {...props}
  >
    {({
      getActorProps,
      getRootProps,
      getInputProps,
      getMenuProps,
      getItemProps,
      inputValue,
      selectedItem,
      highlightedIndex,
      isOpen: isMenuOpen,
      actions: menuActions,
    }) => {
      // This is the value to use to filter (default to value in filter input)
      const filterValueOrInput = filterValue ?? inputValue;
      // Only filter results if menu is open and there are items
      const autoCompleteResults =
        (isOpen && items && autoCompleteFilter(items, filterValueOrInput || '')) || [];
      // Can't search if there are no items
      const hasItems = items && !!items.length;
      // Items are loading if null
      const itemsLoading = items === null;
      // Has filtered results
      const hasResults = !!autoCompleteResults.length;
      // No items to display
      const showNoItems = !busy && !filterValueOrInput && !hasItems;
      // Results mean there was an attempt to search
      const showNoResultsMessage =
        !busy && !busyItemsStillVisible && filterValueOrInput && !hasResults;
      // Hide the input when we have no items to filter, only if
      // emptyHidesInput is set to true.
      const showInput = !hideInput && (hasItems || !emptyHidesInput);
      // When virtualization is turned on, we need to pass in the number of
      // selecteable items for arrow-key limits
      const itemCount =
        virtualizedHeight && autoCompleteResults.filter(i => !i.groupLabel).length;

      return (
        <AutoCompleteRoot {...getRootProps()} className={rootClassName}>
          {children({
            getInputProps,
            getActorProps,
            actions: menuActions,
            isOpen: isMenuOpen,
            selectedItem,
          })}
          {isOpen && (
            <BubbleWithMinWidth
              className={className}
              {...getMenuProps({
                ...menuProps,
                //   style,
                //   css: this.props.css,
                itemCount,
                blendCorner,
                alignMenu,
                menuWithArrow,
              })}
            >
              {itemsLoading && <LoadingIndicator mini />}
              {showInput && (
                <StyledInputWrapper>
                  <StyledInput
                    autoFocus
                    placeholder={searchPlaceholder}
                    {...getInputProps({...inputProps, onChange})}
                  />
                  <InputLoadingWrapper>
                    {(busy || busyItemsStillVisible) && (
                      <LoadingIndicator size={16} mini />
                    )}
                  </InputLoadingWrapper>
                </StyledInputWrapper>
              )}
              <div>
                {menuHeader && <LabelWithPadding>{menuHeader}</LabelWithPadding>}
                <StyledItemList data-test-id="autocomplete-list" maxHeight={maxHeight}>
                  {showNoItems && <EmptyMessage>{emptyMessage}</EmptyMessage>}
                  {showNoResultsMessage && (
                    <EmptyMessage>
                      {noResultsMessage ?? `${emptyMessage} ${t('found')}`}
                    </EmptyMessage>
                  )}
                  {busy && (
                    <BusyMessage>
                      <EmptyMessage>{t('Searching...')}</EmptyMessage>
                    </BusyMessage>
                  )}
                  {!busy && (
                    <List
                      items={autoCompleteResults}
                      itemSize={itemSize}
                      highlightedIndex={highlightedIndex}
                      inputValue={inputValue}
                      getItemProps={getItemProps}
                      onScroll={onScroll}
                      maxHeight={maxHeight}
                    />
                  )}
                </StyledItemList>
                {/* {renderedFooter && <LabelWithPadding>{renderedFooter}</LabelWithPadding>} */}
              </div>
            </BubbleWithMinWidth>
          )}
        </AutoCompleteRoot>
      );
    }}
  </AutoComplete>
);

const AutoCompleteRoot = styled(({isOpen: _isOpen, ...props}) => <div {...props} />)`
  position: relative;
  display: inline-block;
`;

const InputLoadingWrapper = styled('div')`
  display: flex;
  background: #fff;
  align-items: center;
  flex-shrink: 0;
  width: 30px;

  .loading.mini {
    height: 16px;
    margin: 0;
  }
`;

const StyledInputWrapper = styled('div')`
  display: flex;
  border-bottom: 1px solid ${p => p.theme.borderLight};
  border-radius: ${p => `${p.theme.borderRadius} ${p.theme.borderRadius} 0 0`};
  align-items: center;
`;

const StyledInput = styled(Input)`
  flex: 1;
  border: 1px solid transparent;

  &,
  &:focus,
  &:active,
  &:hover {
    border: 0;
    box-shadow: none;
    font-size: 13px;
    padding: ${space(1)};
    font-weight: normal;
    color: ${p => p.theme.gray500};
  }
`;

const StyledItemList = styled('div')<{maxHeight: number | string}>`
  max-height: ${p =>
    typeof p.maxHeight === 'number' ? `${p.maxHeight}px` : p.maxHeight};
  overflow-y: auto;
`;

const BusyMessage = styled('div')`
  display: flex;
  justify-content: center;
  padding: ${space(1)};
`;

const EmptyMessage = styled('div')`
  color: ${p => p.theme.gray400};
  padding: ${space(2)};
  text-align: center;
  text-transform: none;
`;

const BubbleWithMinWidth = styled(DropdownBubble)`
  min-width: 250px;
`;

const LabelWithPadding = styled('div')`
  background-color: ${p => p.theme.gray100};
  border-bottom: 1px solid ${p => p.theme.borderLight};
  border-width: 1px 0;
  color: ${p => p.theme.gray600};
  font-size: ${p => p.theme.fontSizeMedium};

  &:first-child {
    border-top: none;
  }
  &:last-child {
    border-bottom: none;
  }
  padding: ${space(0.25)} ${space(1)};
`;

export default Menu;
