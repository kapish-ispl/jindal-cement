"use client";
import { PageResponse } from '@/types/pageResponse';
import dynamic from 'next/dynamic';
const PageTemplate = dynamic(() => import('./PageTemplate'), { ssr: false });
const HomeBanner = dynamic(() => import('../Layout/HomeBanner'), { ssr: false });

const HomePage = ({ data }: { data: PageResponse }) => {
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 p-0">
                        <HomeBanner bannerMedia={data.media} tagline={data.customField?.tagline} pageTitle={data.title} />
                    </div>
                </div>
            </div>
            <PageTemplate data={data} />
        </>
    )
}

export default HomePage;