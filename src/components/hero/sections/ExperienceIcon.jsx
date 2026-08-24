function PowerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.6 2.8 6.5 13h5.1l-1.2 8.2L17.5 11h-5.1l1.2-8.2Z" />
      <path d="M4 5.5h2.3M17.7 18.5H20" opacity=".55" />
    </svg>
  );
}

function AfterQueryIcon() {
  return (
    <svg viewBox="0 0 118 118" fill="currentColor">
      <g transform="translate(0 11)">
        <path d="M70.004 0H53.138a.896.896 0 0 0-.896.895v5.203c0 .495.401.896.896.896h16.866a.896.896 0 0 0 .896-.896V.895A.896.896 0 0 0 70.004 0Z" />
        <path d="M63.474 12.122H46.607a.896.896 0 0 0-.895.895v5.204c0 .494.4.895.895.895h16.867a.896.896 0 0 0 .895-.895v-5.204a.896.896 0 0 0-.895-.895Z" />
        <path d="M69.071 25.177H40.077a.896.896 0 0 0-.896.895v5.203c0 .495.401.896.896.896h28.994a.896.896 0 0 0 .896-.896v-5.203a.896.896 0 0 0-.896-.895Z" />
        <path d="M50.413 37.299H34.48a.896.896 0 0 0-.896.895v5.204c0 .494.401.895.896.895h15.933a.896.896 0 0 0 .896-.895v-5.204a.896.896 0 0 0-.896-.895Z" />
        <path d="M81.199 50.354H27.017a.896.896 0 0 0-.896.895v5.203c0 .495.401.896.896.896h54.182a.896.896 0 0 0 .895-.896v-5.203a.896.896 0 0 0-.895-.895Z" />
        <path d="M38.286 63.409H21.419a.896.896 0 0 0-.895.895v5.203c0 .494.4.895.895.895h16.867a.896.896 0 0 0 .895-.895v-5.203a.896.896 0 0 0-.895-.895ZM97.058 63.409H82.057a.896.896 0 0 0-.895.895v5.203c0 .494.4.895.895.895h15.001a.896.896 0 0 0 .896-.895v-5.203a.896.896 0 0 0-.896-.895Z" />
        <path d="M33.621 76.463H16.755a.896.896 0 0 0-.896.895v5.204c0 .494.401.895.896.895H33.62a.896.896 0 0 0 .896-.895v-5.204a.896.896 0 0 0-.896-.895ZM104.521 76.463h-17.8a.896.896 0 0 0-.895.895v5.204c0 .494.4.895.895.895h17.8a.896.896 0 0 0 .896-.895v-5.204a.896.896 0 0 0-.896-.895Z" />
        <path d="M41.085 88.585H.896A.896.896 0 0 0 0 89.481v5.203c0 .494.401.895.896.895h40.189a.896.896 0 0 0 .895-.895V89.48a.896.896 0 0 0-.895-.896ZM116.649 88.585H81.124a.896.896 0 0 0-.895.896v5.203c0 .494.4.895.895.895h35.525a.896.896 0 0 0 .895-.895V89.48a.896.896 0 0 0-.895-.896Z" />
      </g>
    </svg>
  );
}

function EducationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3.5 9 8.5-5 8.5 5M5 10.5h14M6.5 10.5v7M10.2 10.5v7M13.8 10.5v7M17.5 10.5v7M4.5 19.5h15" />
    </svg>
  );
}

function MastercardIcon() {
  return (
    <svg viewBox="0 0 32 22">
      <circle cx="11" cy="11" r="9" fill="#EB001B" />
      <circle cx="21" cy="11" r="9" fill="#F79E1B" />
      <path d="M16 4.2a9 9 0 0 1 0 13.6 9 9 0 0 1 0-13.6Z" fill="#FF5F00" />
    </svg>
  );
}

function InsuranceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.8 19 5.5v5.8c0 4.6-2.8 8-7 9.9-4.2-1.9-7-5.3-7-9.9V5.5L12 2.8Z" />
      <path d="M8.8 12h6.4M12 8.8v6.4" opacity=".72" />
    </svg>
  );
}

const icons = {
  power: PowerIcon,
  afterquery: AfterQueryIcon,
  education: EducationIcon,
  mastercard: MastercardIcon,
  insurance: InsuranceIcon,
};

export default function ExperienceIcon({ icon }) {
  const Icon = icons[icon] ?? PowerIcon;

  return (
    <span className={`ah-experience-logo ${icon}`} aria-hidden="true">
      <Icon />
    </span>
  );
}
