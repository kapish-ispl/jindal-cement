export const dynamic = "force-dynamic";

import HomePage from "@/components/Layout/HomePageTemplate";
import { GET_SPECIFIC_PAGE_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import { PageResponse } from "@/types/pageResponse";
import MilestoneSection from "@/utils/MilestoneSection";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
}

export async function generateMetadata(): Promise<Metadata> {
  const fetchedInfo = (await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=${CONSTANTS.LANDING_SLUG}`,
    CONSTANTS.REQUEST_GET,
    'server'
  )) as ApiResponse<PageResponse>;

  const pageData = fetchedInfo?.data;
  if (!pageData) return {};

  const metaTitle = pageData.meta_title && pageData.meta_title !== ""
    ? `${pageData.meta_title} | Jindal Steel`
    : `${pageData.title} | Jindal Steel`;

  const metaDescription =
    pageData.meta_description ||
    pageData.description ||
    "Jindal Steel and Power Limited (JSPL) is a leading Indian steel and energy company.";

  const metaKeywords =
    pageData.meta_keyword ||
    "Jindal Steel, JSPL, Steel Manufacturing, Energy Solutions";

  const metaImage = "https://www.jindalsteel.com/images/logo/meta.jpg";
  const siteUrl = "https://www.jindalsteel.com/";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: metaKeywords,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: siteUrl,
      type: "website",
      images: [
        {
          url: metaImage,
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@InsphereSoln",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
  };
}

export default async function Home() {
  const fetchedInfo = (await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=${CONSTANTS.LANDING_SLUG}`,
    CONSTANTS.REQUEST_GET,
    'server'
  )) as ApiResponse<PageResponse>;

  const pageData = fetchedInfo?.data;
  if (!pageData) return notFound();

  return (
    <>
      <HomePage data={pageData} />
    </>
  )
}
