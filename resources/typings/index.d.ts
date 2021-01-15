export type Icon = {
  width?: number;
  height?: number;
  size?: number;

  onClick?: () => void;
}

export type Toggle = Icon & {
  enabled: boolean;
}
