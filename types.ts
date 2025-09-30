export enum CardType {
  Story = 'STORY',
  Surprise = 'SURPRISE',
}

export interface Story {
  id: number;
  type: CardType.Story;
  organization: string;
  title: string;
  content: string;
  image: string;
}

export interface Surprise {
  id: number;
  type: CardType.Surprise;
  title: string;
  content: string;
}

export type StoryCard = Story | Surprise;

export interface SupportPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  contribution: number; // How many units this package contributes to the goal
}

export interface Challenge {
  id: string;
  title: string;
  organization: string;
  description: string;
  goal: number;
  current: number;
  deadline: string;
  participants: number;
  image: string;
  productName: string;
  packages: SupportPackage[];
}

export interface CateringProvider {
  id: string;
  name: string;
  specialties: string[];
  minPeople: number;
  maxPeople: number;
  pricePerPerson: number;
  deliveryTime: string;
  issue: string; // 公益議題
  description: string;
  image: string;
}

export enum ProductType {
  Cookie = "餅乾",
  Cake = "蛋糕",
  Snack = "點心",
  GiftBox = "禮盒",
}

export enum ProductStyle {
  Healthy = "健康取向",
  Festive = "節慶限定",
  Creative = "創意口味",
}

export enum CharityIssue {
  ShelteredWorkshop = "庇護工坊",
  RuralEducation = "偏鄉教育",
  WomenEmployment = "婦女就業",
}

export interface Product {
  id: string;
  name: string;
  organization: string;
  price: number;
  image: string;
  type: ProductType;
  style: ProductStyle;
  issue: CharityIssue;
  dateAdded: string; // YYYY-MM-DD
  sales: number;
}
