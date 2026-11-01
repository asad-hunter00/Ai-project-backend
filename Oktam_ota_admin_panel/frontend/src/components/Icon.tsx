export type IconName =
  | "phone"
  | "arrow"
  | "door"
  | "users"
  | "snow"
  | "pin"
  | "clock"
  | "image"
  | "cup"
  | "sun"
  | "moon"
  | "menu"
  | "close"
  | "chair";
const paths: Record<IconName, React.ReactNode> = {
  phone: <path d="m7 3 3 5-2 2c1.5 3 3 4.5 6 6l2-2 5 3-1 4C10 22 2 14 3 4z" />,
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  door: (
    <>
      <path d="M5 21V4l12-2v19M2 21h20M17 4h3v17M12 12v2" />
    </>
  ),
  users: (
    <>
      <circle cx="12" cy="6" r="3" />
      <path d="M6 21v-4a6 6 0 0 1 12 0v4ZM3 10a3 3 0 0 0 0 6m18-6a3 3 0 0 1 0 6M1 21v-2a4 4 0 0 1 4-4m18 6v-2a4 4 0 0 0-4-4" />
    </>
  ),
  snow: (
    <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l4-1-1-4m13 9-4 1 1 4M4 14l4 1-1 4m13-9-4-1 1-4" />
  ),
  pin: (
    <>
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8" cy="8" r="1" />
      <path d="m3 17 5-5 4 4 3-3 6 6" />
    </>
  ),
  cup: (
    <>
      <path d="M4 11h14c0 7-3 9-7 9s-7-2-7-9ZM18 12h2a3 3 0 0 1 0 6h-4M2 22h19M8 8c-3-3 3-3 0-6m6 6c-3-3 3-3 0-6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1v2m0 18v2M1 12h2m18 0h2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2" />
    </>
  ),
  moon: <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="m5 5 14 14M5 19 19 5" />,
  chair: (
    <path d="M5 13V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8M3 10v9h18v-9M5 19v3m14-3v3M3 15h18" />
  ),
};
export function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.45"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
export function RoomDrawing() {
  return (
    <svg
      viewBox="0 0 500 350"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <path d="M306 254V68h122v200M312 248V74h110v184M328 248V137c0-45 39-57 39-57s39 12 39 57v111M336 248V141c0-35 31-51 31-51s31 16 31 51v107" />
      <path d="m336 143 62 62m-62-36 62 62m-62-88 62 62m-62-10 44-44m-44 70 62-62m-62 88 62-62M306 60l61-17 61 17M301 62h133M293 275l159 8M30 300l425 23M60 274l387 23M43 310l355 27" />
      <path d="M88 225v57m0-45-21-34m21 22 20-31m-20 8-17-25m17 11 15-39M78 282h22l5 27H72zM185 270v48m65-47v45M141 257c0-13 150-13 150 0s-150 13-150 0Zm0 0v12c0 13 150 13 150 0v-12M192 245l3-17h34l3 17M195 228c-1-9 36-9 34 0m-26-4v-8m6 5v-6m6 6v-9M113 262v-44h60v23M116 221h54M119 248h30M124 261v22M278 240v-25h61v62h-49M282 220h53M292 247h38M329 277v22" />
      <path d="M69 203c-23-1-29-21-29-21s22-1 29 21ZM106 196c22-10 20-29 20-29s-20 9-20 29ZM71 177c-23-4-25-26-25-26s23 5 25 26ZM103 151c19-10 17-31 17-31s-20 10-17 31Z" />
      <path d="m348 108 10 8-10 8m39-16-10 8 10 8M350 236h35M62 311l-20 5m366-15 25 4" />
    </svg>
  );
}
