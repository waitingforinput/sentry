import flatMap from 'lodash/flatMap';

import {Items} from './types';

function filterItems(items: Items, inputValue: string) {
  return items.filter(
    item =>
      (item.searchKey || `${item.value} ${item.label}`)
        .toLowerCase()
        .indexOf(inputValue.toLowerCase()) > -1
  );
}

function filterGroupedItems(groups, inputValue) {
  return groups
    .map(group => ({
      ...group,
      items: filterItems(group.items, inputValue),
    }))
    .filter(group => group.items.length > 0);
}

export function autoCompleteFilter(items: Items, inputValue: string) {
  let itemCount = 0;

  if (!items) {
    return [];
  }

  if (items[0] && items[0].items) {
    //if the first item has children, we assume it is a group
    return flatMap(filterGroupedItems(items, inputValue), item => {
      const groupItems = item.items.map(groupedItem => ({
        ...groupedItem,
        index: itemCount++,
      }));

      // Make sure we don't add the group label to list of items
      // if we try to hide it, otherwise it will render if the list
      // is using virtualized rows (because of fixed row heights)
      if (item.hideGroupLabel) {
        return groupItems;
      }

      return [{...item, groupLabel: true}, ...groupItems];
    });
  }

  return filterItems(items, inputValue).map((item, index) => ({...item, index}));
}

export function getHeight(items: Items) {
  const {maxHeight, virtualizedHeight, virtualizedLabelHeight} = this.props;
  const minHeight = virtualizedLabelHeight
    ? items.reduce(
        (a, r) => a + (r.groupLabel ? virtualizedLabelHeight : virtualizedHeight),
        0
      )
    : items.length * virtualizedHeight;
  return Math.min(minHeight, maxHeight);
}
