"use client";
import { useEffect, useState, useContext } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { AppContext } from "@/context/AppContext";
import { serverRequest } from "@/services/getServerSideRender";
import { CONSTANTS } from "@/config/constant";
import { GET_POST_ENDPOINT } from "@/config/apiConfig";
import dynamic from "next/dynamic";
import { PageResponse } from "@/types/pageResponse";

/* ---------------------------------------------------
   TYPES
--------------------------------------------------- */

interface PostComponentProps {
    postData: PageResponse[];
    compSlug: string;
    totalPost: number;
    itemsPerPage: number;
    itemstoshow: string;
    isproduct: string;
    title?: string
}

type DynamicComponent = React.ComponentType<PostComponentProps>;


const componentMap: Record<string, DynamicComponent> = {
    FinancialCard: dynamic<PostComponentProps>(() => import("./FinancialCard")),
    AwardsCard: dynamic<PostComponentProps>(() => import("./AwardsCard")),
    OurOfficesCard: dynamic<PostComponentProps>(() => import("./OurOfficesCard")),
    ProductCard: dynamic<PostComponentProps>(() => import("./ProductCard")),
    CenterModeSlider: dynamic<PostComponentProps>(() => import("./CenterModeSlider")),
    ProductSlider: dynamic<PostComponentProps>(() => import("./ProductSlider")),
    OurOfficesLisitng: dynamic<PostComponentProps>(() => import("./OurOfficesLisitng")),
    LeadershipCard: dynamic<PostComponentProps>(() => import("./LeadershipCard")),
    NotFound: dynamic<PostComponentProps>(() => import("@/app/not-found"))
};

interface PropsType {
    slug?: string;
    limit?: number;
    title?: string
    type?: string;
    components?: string;
    itemstoshow?: string;
    isproduct?: string;
}

export default function PostList(props: PropsType) {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const page = searchParams.get("page");
    const njOfficeCountries = searchParams.get("country");
    const taxonomy = searchParams.get("taxonomy");

    const [postData, setPostData] = useState<PageResponse[]>([]);
    const [totalPost, setTotalPost] = useState<number>(0);
    const [filteredTag, setFilteredTag] = useState<string | null>(null);

    useEffect(() => {
        let slugInfo = props.slug;
        let limit = props.limit !== undefined ? Number(props.limit) : 9;

        if (pathname === "/") {
            slugInfo += `&metaInfo[type_1599485711]=${props.type}`;
            limit = 3;
        }

        if (njOfficeCountries && taxonomy === props.slug) {
            slugInfo += `&metaInfo[country_1762842083]=${njOfficeCountries}`;
        }

        const getPostData = async () => {
            if (!props.slug) return;

            // if (props.slug === "product" && contextInfo.productData?.length > 0) {
            //     setPostData(contextInfo.productData);
            //     return;
            // }

            const offset = page ? (Number(page) - 1) * limit : 0;

            const taxonomyInfo = await serverRequest(
                {},
                `${GET_POST_ENDPOINT}?slug=${slugInfo}&limit=${limit}&offset=${offset}`,
                CONSTANTS.REQUEST_GET
            );

            if (taxonomyInfo.code === CONSTANTS.STATUS_SUCCESS) {
                setPostData(taxonomyInfo.data);
                setTotalPost(taxonomyInfo.total);
            } else {
                setPostData([]);
                setTotalPost(0);
            }
        };

        if (page !== filteredTag) {
            setPostData([]);
            setFilteredTag(page);
        }

        getPostData();
    }, [props.slug, page, filteredTag, pathname, njOfficeCountries]);

    const Component = componentMap[props.components || 'NotFound'];

    return Component ? (
        <Component
            postData={postData}
            title={props.title != "" ? props.title : ''}
            compSlug={props.slug || ""}
            totalPost={totalPost}
            itemsPerPage={props.limit || 9}
            itemstoshow={props.itemstoshow || '2'}
            isproduct={props.isproduct || 'false'}
        />
    ) : (
        <div>Loading...</div>
    );
}
