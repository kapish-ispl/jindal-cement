"use client";
import Filters from '@/components/shortcodes/Filters';
import { PageResponse } from '@/types/pageResponse';
import React from 'react';

interface postDataProps {
    title: string,
    content: string,
    metaInfo: {
        email: string,
        telephone: string
    }
}
type Props = {
    postData: PageResponse[];
    compSlug?: string
};

const OurOfficesLisitng: React.FC<Props> = ({ postData = [], compSlug }) => {
    return (
        <>
            <Filters compSlug={compSlug} />

            {postData && postData.length > 0 && postData.map((post, index: number) => (


                <div className="col-12 col-md-6 col-lg-4" key={index}>
                    <div className="c-cardBox__wrapper v3">
                        <span className="c-cardBox__wrapper-top">
                            <span className="c-content-24 ft_semiBold clr-gray">{post.title}</span>
                        </span>
                        <span className="c-cardBox__wrapper-bottom">
                            <span className="content">
                                <div className="c-content-20 ft_regular mb-3">{post.content}</div>
                                {(post.metaInfo.email && post.metaInfo.email != '') &&
                                    <div className="c-content-20 ft_regular mb-3"><span className='ft_medium'>Email: </span>{post.metaInfo.email}</div>
                                }
                                {(post.metaInfo.telephone && post.metaInfo.telephone != '') &&
                                    <div className="c-content-20 ft_regular mb-3"><span className='ft_medium'>Tel: </span>{post.metaInfo.telephone}</div>
                                }
                            </span>
                        </span>
                    </div>
                </div>



            ))}


        </>
    )
}

export default OurOfficesLisitng;