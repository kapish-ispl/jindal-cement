export interface PageResponse {
  category: string;
  id: number;
  guid: string;
  networkId: number;
  title: string;
  content: string;
  slug: string;
  status: number;
  meta_title: string;
  meta_keyword: string;
  meta_description: string;
  description: string;
  customField?: {
    tagline?: string;
  };
  metaInfo: {
    [key: string]: string | number | boolean | null | undefined;
  };
  media?: MediaItem[];
  parentPageDetails: ParentPageDetail[];
  featuredMedia?: MediaItem;
  url: string;
}

export interface MediaItem {
  type: string;
  cdnPath: string;
  caption?: string | null;
}
export interface ParentPageDetail {
  id: number;
  title: string;
  slug: string;
}
