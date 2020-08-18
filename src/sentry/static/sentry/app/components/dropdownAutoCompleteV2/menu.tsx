import React from 'react';
import {AutoSizer, List} from 'react-virtualized';
import styled from '@emotion/styled';

import {t} from 'app/locale';
import AutoComplete from 'app/components/autoComplete';
import DropdownBubble from 'app/components/dropdownBubble';
import Input from 'app/views/settings/components/forms/controls/input';
import LoadingIndicator from 'app/components/loadingIndicator';
import space from 'app/styles/space';

import {Items} from './types';
import {autoCompleteFilter} from './utils';

type ChildrenProps = {
  getInputProps: () => void;
  getActorProps: () => {onClick: () => void};
  actions: {open: () => void; close: () => void};
  isOpen: boolean;
  selectedItem: Items[0];
};

type Props = {
  // flat item array | grouped item array
  items: Items;
  /**
   * If this is undefined, autocomplete filter will use this value instead of the
   * current value in the filter input element.
   *
   * This is useful if you need to strip characters out of the search
   */
  filterValue: string;

  /**
   * Show loading indicator next to input and "Searching..." text in the list
   */
  busy: boolean;

  /**
   * Show loading indicator next to input but don't hide list items
   */
  busyItemsStillVisible: boolean;

  /**
   * Hide's the input when there are no items. Avoid using this when querying
   * results in an async fashion.
   */
  emptyHidesInput: boolean;

  /**
   * When an item is selected (via clicking dropdown, or keyboard navigation)
   */
  onSelect: () => void;
  /**
   * When AutoComplete input changes
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Callback for when dropdown menu opens
   */
  onOpen: () => void;

  /**
   * Callback for when dropdown menu closes
   */
  onClose: () => void;

  /**
   * Message to display when there are no items initially
   */
  emptyMessage: React.ReactNode;

  /**
   * Message to display when there are no items that match the search
   */
  noResultsMessage: React.ReactNode;

  /**
   * Presentational properties
   */

  /**
   * Dropdown menu alignment.
   */
  alignMenu: 'left' | 'right';

  /**
   * Should menu visually lock to a direction (so we don't display a rounded corner)
   */
  blendCorner: boolean;

  /**
   * Hides the default filter input
   */
  hideInput: boolean;

  /**
   * Max height of dropdown menu. Units are assumed as `px` if number, otherwise will assume string has units
   */
  maxHeight: number | string;

  /**
   * Supplying this height will force the dropdown menu to be a virtualized list.
   * This is very useful (and probably required) if you have a large list. e.g. Project selector with many projects.
   *
   * Currently, our implementation of the virtualized list requires a fixed height.
   */
  virtualizedHeight: number;

  /**
   * If you use grouping with virtualizedHeight, the labels will be that height unless specified here
   */
  virtualizedLabelHeight: number;

  /**
   * Search input's placeholder text
   */
  searchPlaceholder: string;

  /**
   * Changes the menu style to have an arrow at the top
   */
  menuWithArrow: boolean;

  menuFooter: ({actions}: {actions: any}) => void | React.ReactNode;
  menuHeader: React.ReactNode;
  /**
   * Props to pass to menu component
   */
  menuProps: {};

  /**
   * Props to pass to input/filter component
   */
  inputProps: {};

  /**
   * renderProp for the end (right side) of the search input
   */
  inputActions: () => void | React.ReactNode;

  // css: PropTypes.object,
  // style: PropTypes.object,

  children: (props: ChildrenProps) => React.ReactNode;

  /**
   * Callback for when dropdown menu is being scrolled
   */
  onScroll?: () => void;

  /**
   * Used to control dropdown state
   */
  isOpen?: boolean;

  /**
   * Size for dropdown items
   */
  itemSize?: 'zero' | 'small';

  /**
   * for passing simple styles to the root container
   */
  rootClassName?: string;
  className?: string;
};

const Menu = ({
  maxHeight = 300,
  blendCorner = true,
  emptyMessage = t('No items'),
  searchPlaceholder = t('Filter search'),
  isOpen = false,
  onSelect = () => {},
  inputActions,
  onChange,
  onClose,
  onOpen,
  hideInput,
  filterValue,
  emptyHidesInput,
  items,
  busy,
  menuFooter,
  busyItemsStillVisible,
  rootClassName,
  className,
  children,
  menuHeader,
  itemSize,
  onScroll,
  alignMenu,
  noResultsMessage,
  virtualizedHeight,
  menuWithArrow,
  actions,
  menuProps,
  inputProps,
  ...props
}: Props) => {
  return (
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
        return (
          <AutoCompleteRoot {...getRootProps()} className={rootClassName}>
            {children({
              getInputProps,
              getActorProps,
              actions: menuActions,
              isOpen: isMenuOpen,
              selectedItem,
            })}
          </AutoCompleteRoot>
        );
        // // This is the value to use to filter (default to value in filter input)
        // const filterValueOrInput =
        //   typeof filterValue !== 'undefined' ? filterValue : inputValue;
        // // Only filter results if menu is open and there are items
        // const autoCompleteResults =
        //   (isOpen && items && autoCompleteFilter(items, filterValueOrInput || '')) || [];
        // // Can't search if there are no items
        // const hasItems = items && !!items.length;
        // // Items are loading if null
        // const itemsLoading = items === null;
        // // Has filtered results
        // const hasResults = !!autoCompleteResults.length;
        // // No items to display
        // const showNoItems = !busy && !filterValueOrInput && !hasItems;
        // // Results mean there was an attempt to search
        // const showNoResultsMessage =
        //   !busy && !busyItemsStillVisible && filterValueOrInput && !hasResults;
        // // Hide the input when we have no items to filter, only if
        // // emptyHidesInput is set to true.
        // const showInput = !hideInput && (hasItems || !emptyHidesInput);
        // // When virtualization is turned on, we need to pass in the number of
        // // selecteable items for arrow-key limits
        // const itemCount =
        //   virtualizedHeight && autoCompleteResults.filter(i => !i.groupLabel).length;
        // const renderedFooter =
        //   typeof menuFooter === 'function' ? menuFooter({actions}) : menuFooter;
        // const renderedInputActions =
        //   typeof inputActions === 'function' ? inputActions() : inputActions;
        // return (
        //   <AutoCompleteRoot {...getRootProps()} className={rootClassName}>
        // {children({
        //   getInputProps,
        //   getActorProps,
        //   actions,
        //   isOpen,
        //   selectedItem,
        // })}
        //     {isOpen && (
        //       <BubbleWithMinWidth
        //         className={className}
        //         {...getMenuProps({
        //           ...menuProps,
        //           //   style,
        //           //   css: this.props.css,
        //           itemCount,
        //           blendCorner,
        //           alignMenu,
        //           menuWithArrow,
        //         })}
        //       >
        //         {itemsLoading && <LoadingIndicator mini />}
        //         {showInput && (
        //           <StyledInputWrapper>
        //             <StyledInput
        //               autoFocus
        //               placeholder={searchPlaceholder}
        //               {...getInputProps({...inputProps, onChange})}
        //             />
        //             <InputLoadingWrapper>
        //               {(busy || busyItemsStillVisible) && (
        //                 <LoadingIndicator size={16} mini />
        //               )}
        //             </InputLoadingWrapper>
        //             {renderedInputActions}
        //           </StyledInputWrapper>
        //         )}
        //         <div>
        //           {menuHeader && <LabelWithPadding>{menuHeader}</LabelWithPadding>}
        //           <StyledItemList data-test-id="autocomplete-list" maxHeight={maxHeight}>
        //             {showNoItems && <EmptyMessage>{emptyMessage}</EmptyMessage>}
        //             {showNoResultsMessage && (
        //               <EmptyMessage>
        //                 {noResultsMessage ?? `${emptyMessage} ${t('found')}`}
        //               </EmptyMessage>
        //             )}
        //             {busy && (
        //               <BusyMessage>
        //                 <EmptyMessage>{t('Searching...')}</EmptyMessage>
        //               </BusyMessage>
        //             )}
        //             {!busy &&
        //               renderList({
        //                 items: autoCompleteResults,
        //                 itemSize,
        //                 highlightedIndex,
        //                 inputValue,
        //                 getItemProps,
        //                 onScroll,
        //               })}
        //           </StyledItemList>
        //           {renderedFooter && (
        //             <LabelWithPadding>{renderedFooter}</LabelWithPadding>
        //           )}
        //         </div>
        //       </BubbleWithMinWidth>
        //     )}
        //   </AutoCompleteRoot>
        // );
      }}
    </AutoComplete>
  );
};

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

const getItemPaddingForSize = size => {
  if (size === 'small') {
    return `${space(0.5)} ${space(1)}`;
  }
  if (size === 'zero') {
    return '0';
  }

  return space(1);
};

const AutoCompleteItem = styled('div')`
  /* needed for virtualized lists that do not fill parent height */
  /* e.g. breadcrumbs (org height > project, but want same fixed height for both) */
  display: flex;
  flex-direction: column;
  justify-content: center;

  font-size: 0.9em;
  background-color: ${p =>
    p.index === p.theme.highlightedIndex ? p.theme.gray100 : 'transparent'};
  padding: ${p => getItemPaddingForSize(p.size)};
  cursor: pointer;
  border-bottom: 1px solid ${p => p.theme.borderLight};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${p => p.theme.gray100};
  }
`;

const LabelWithBorder = styled('div')`
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
`;

const LabelWithPadding = styled(LabelWithBorder)`
  padding: ${space(0.25)} ${space(1)};
`;

const GroupLabel = styled('div')`
  padding: ${space(0.25)} ${space(1)};
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

export default Menu;
