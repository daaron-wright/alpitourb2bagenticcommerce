// Type declarations for custom web components used across the project

declare namespace JSX {
  interface IntrinsicElements {
    'image-slot': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      id?: string;
      shape?: string;
      radius?: string;
      placeholder?: string;
      label?: string;
      width?: string;
      height?: string;
      src?: string;
    }, HTMLElement>;
  }
}
