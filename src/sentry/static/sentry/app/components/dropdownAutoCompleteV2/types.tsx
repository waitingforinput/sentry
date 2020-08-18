type Item = {
  value: any;
  searchKey: string;
  label: () => void | React.ReactNode;
};

export type Items =
  | Array<Item>
  | Array<Item & {items: Array<Item>; hideGroupLabel: boolean}>;
