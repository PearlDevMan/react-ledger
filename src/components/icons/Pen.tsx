export default function PenIcon({ width = 24, height = 24, className, style }: BaseIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20.821 3.179C20.061 2.418 19.049 2 17.974 2C16.9 2 15.888 2.418 15.128 3.179L3.71899 14.587C3.71899 14.587 3.71799 14.59 3.71599 14.591C3.63499 14.673 3.49699 14.889 3.45499 15.052L2.02999 20.756C1.94399 21.096 2.04499 21.458 2.29299 21.705L2.29399 21.706L2.29499 21.707C2.54299 21.955 2.90299 22.056 3.24399 21.971L8.94799 20.544C9.11099 20.502 9.32799 20.364 9.40899 20.283C9.40999 20.282 9.41299 20.28 9.41299 20.28L20.822 8.873C21.582 8.112 22.001 7.102 22 6.026C22 4.951 21.582 3.94 20.822 3.179H20.821ZM14.411 6.728L17.274 9.591L8.70599 18.159L5.84299 15.296L14.411 6.728ZM4.37499 19.626L4.96999 17.252L6.74999 19.033L4.37499 19.626ZM19.409 4.594C20.173 5.359 20.173 6.693 19.409 7.458L18.69 8.178L15.824 5.313L16.545 4.594C17.31 3.83 18.644 3.829 19.409 4.594Z"
        fill="currentColor"
      />
    </svg>
  );
}