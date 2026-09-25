const OUTLINE_PATH =
  'M14.4706 4H9.76471V7.76471H6V20H18.2353V7.76471H14.4706V4ZM13.5294 8.70589V11.0588H14.4706V8.70589H17.2941V19.0588H6.94118V8.70589H9.76471V11.0588H10.7059V8.70589H13.5294ZM13.5294 7.76471V4.94118H10.7059V7.76471H13.5294Z';

const FILLED_PATH =
  'M14.4706 4H9.76471V7.76471H6V20H18.2353V7.76471H14.4706V4ZM13.5294 7.76471V11.0588H14.4706V7.76471H13.5294ZM10.7059 7.76471V11.0588H9.76471V7.76471H10.7059ZM10.7059 7.76471H13.5294V4.94118H10.7059V7.76471Z';

type BagIconProps = {
  filled?: boolean;
};

export const BagIcon = ({ filled = false }: BagIconProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fillRule="evenodd" clipRule="evenodd" d={filled ? FILLED_PATH : OUTLINE_PATH} />
    </svg>
  );
};
