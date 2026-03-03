import { notFound, redirect } from "next/navigation";

import { GET_SPECIFIC_PAGE_ENDPOINT } from "@/config/apiConfig";
import { CONSTANTS } from "@/config/constant";
import { serverRequest } from "@/services/getServerSideRender";
import PageTemplate from "@/components/Layout/PageTemplate";
import InnerBanner from "@/components/Layout/InnerBanner";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;

  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=${slug}`,
    CONSTANTS.REQUEST_GET
  );

  const pageData = fetchedInfo?.data;

  if (!pageData || pageData.length === 0) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: pageData.meta_title && pageData.meta_title !== "" ? `${pageData.meta_title} | Jindal Steel` : `${pageData.title} | Jindal Steel`,
    description: pageData.meta_description || 'Jindal Steel',
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;

  if (slug === 'home-v2`') {
    redirect('/');
  }

  const fetchedInfo = await serverRequest(
    {},
    `${GET_SPECIFIC_PAGE_ENDPOINT}?slug=${slug}`,
    CONSTANTS.REQUEST_GET,
    'server'
  );

  if (!fetchedInfo?.data || fetchedInfo.data.length === 0) {
    return notFound();
  }

  const pageData = fetchedInfo.data;
  return (
    <>
      <div className="container-fluid generic_bottom_spacer">
        <div className="row">
          <div className="col-12 p-0">
            <InnerBanner
              label={pageData.title}
              tagline={pageData?.customField?.tagline}
              slug={pageData.slug}
              currentPage={pageData}
              innerBanner={pageData.media}
            />
          </div>
        </div>
      </div>
      <PageTemplate data={pageData} />
    </>
  );
}
