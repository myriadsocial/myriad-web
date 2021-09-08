interface ExperienceDummy {
  title: string;
  creator: string;
  imgUrl: string;
}

interface ExperienceListProps {
  experiences: ExperienceDummy[];
}

export type {ExperienceListProps};
