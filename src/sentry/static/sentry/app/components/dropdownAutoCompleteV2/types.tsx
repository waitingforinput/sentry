type Item = {
  id: string;
  value: Record<string, any> | string;
  label:
    | (({inputValue}: {inputValue: string}) => React.ReactElement)
    | React.ReactElement;
  groupLabel: boolean;
  searchKey?: string;
};

export type Items =
  | Array<Item>
  | Array<Item & {items: Array<Item>; hideGroupLabel: boolean}>;

export type ItemSize = 'zero' | 'small';
