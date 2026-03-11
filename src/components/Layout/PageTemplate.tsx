'use client'
import React from 'react';
import parse, { HTMLReactParserOptions, Element, attributesToProps, domToReact, DOMNode } from 'html-react-parser';
import dynamic from 'next/dynamic';
import CustomSliderCategory, { CategoryItemElementProps, CategorySlide } from '@/utils/CustomSliderCategory';
import { PageResponse } from '@/types/pageResponse';
import { SlideItem, SlideItemProps } from '@/utils/CustomSectorScroll';
import { CustomReactElement, TabItem } from '@/utils/Tabs';



const SplitAnimation = dynamic(() => import('../SplitText'), { ssr: false });
const BlurAnimation = dynamic(() => import('../BlurText'), { ssr: false });
const Counter = dynamic(() => import('../AnimatedCountUp'), { ssr: false });
const CardStackSlider = dynamic(() => import('../CardStackSlider'), { ssr: false });
const ScrollAnimation = dynamic(() => import('../ScrollAnimation'), { ssr: false });
const PostList = dynamic(() => import('@/utils/PostList'), { ssr: false });
const CustomForm = dynamic(() => import('@/utils/CustomForm'), { ssr: false });
const CustomMap = dynamic(() => import('@/utils/CustomMap'), { ssr: false });
const CustomMapIndia = dynamic(() => import('@/utils/CustomMapIndia'), { ssr: false });
const CustomContentSlider = dynamic(() => import('../CustomContentSlider'), { ssr: false });
const CustomStickyCard = dynamic(() => import('@/utils/CustomStickyCard'), { ssr: false });
const CustomZoomScrollEffect = dynamic(() => import('@/utils/CustomZoomScrollEffect'), { ssr: false });
const CustomSectorScroll = dynamic(() => import('@/utils/CustomSectorScroll'), { ssr: false });
const BackgroundImageSlider = dynamic(() => import('@/utils/BackgroundImageSlider'), { ssr: false });
const CustomSectorScrollAnimate = dynamic(() => import('@/utils/CustomSectorScrollAnimate'), { ssr: false });
const CustomSectorLinkSlider = dynamic(() => import('@/utils/CustomSectorLinkSlider'), { ssr: false });
const CustomZoomEffect = dynamic(() => import('@/utils/CustomZoomEffect'), { ssr: false });
const CustomLogoScroll = dynamic(() => import('@/utils/CustomLogoScroll'), { ssr: false });
const FrammerSlider = dynamic(() => import('../FrammerSlider'), { ssr: false });
const CustomSilder = dynamic(() => import('@/utils/CustomSilder'), { ssr: false });
const CustomHorizontalScroll = dynamic(() => import('@/utils/CustomHorizontalScroll'), { ssr: false });
const ReadMoreModal = dynamic(() => import("@/utils/ReadMoreModal"), { ssr: false });
const ReadMore = dynamic(() => import("@/utils/ReadMore"), { ssr: false });
const Tabs = dynamic(() => import("@/utils/Tabs"), { ssr: false });
const CardStack = dynamic(() => import("@/utils/CardStack"), { ssr: false });
const CardSwipeSlider = dynamic(() => import("@/utils/CardSwipeSlider"), { ssr: false });
const CategorySlider = dynamic(() => import("@/utils/CategorySlider"), { ssr: false });
const CustomCarouselSlider = dynamic(() => import("@/utils/CustomCarouselSlider"), { ssr: false });
const StackSlider = dynamic(() => import("@/utils/StackSlider"), { ssr: false });
const StackProjects = dynamic(() => import("@/utils/StackProjects"), { ssr: false });
const VerticalCarousel = dynamic(() => import("@/utils/VerticalCarousel"), { ssr: false });
const TextScrollAnimation = dynamic(() => import("@/utils/TextScrollAnimation"), { ssr: false });
const MilestoneSection = dynamic(() => import("@/utils/MilestoneSection"), { ssr: false });
const CementSlider = dynamic(() => import("@/utils/CementSlider"), { ssr: false });
const SustainabilityScroll = dynamic(() => import("@/utils/SustainabilitySection"), { ssr: false });


const PageTemplate = ({ data }: { data: PageResponse }) => {
    const options: HTMLReactParserOptions = {
        replace: (domNode) => {
            if (domNode instanceof Element && domNode.attribs) {
                if (domNode.name === "custompost") {
                    const props = attributesToProps(domNode.attribs);
                    return <PostList {...props} />;
                }
                if (domNode.name == "animatedcountup") {
                    const props = attributesToProps(domNode.attribs);
                    const toValue = props.to ? Number(props.to) : 0;
                    return <Counter to={toValue} />;
                }

                if (domNode.name === "splitanimation") {
                    const props = attributesToProps(domNode.attribs);
                    return <SplitAnimation text={String(props.text)} />;
                }
                if (domNode.name === "bluranimation") {
                    const props = attributesToProps(domNode.attribs);
                    return <BlurAnimation text={String(props.text)} />;
                }
                if (domNode.name === "cardstackslider") {
                    const props = attributesToProps(domNode.attribs);
                    return <CardStackSlider {...props} />;
                }
                if (domNode.name === "cardswipeslider") {
                    return <CardSwipeSlider />
                }
                if (domNode.name === "cementslider") {
                    return <CementSlider />
                }
                if (domNode.name === "sustainabilityscroll") {
                    return <SustainabilityScroll />
                }
                if (domNode.name === "customcarouselslider") {
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomCarouselSlider data={Array.isArray(children) ? children : [children]} />
                }
                if (domNode.name === "verticalcarousel") {
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <VerticalCarousel data={Array.isArray(children) ? children : [children]} />
                }
                if (domNode.name === "textscrollanimation") {
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <TextScrollAnimation data={Array.isArray(children) ? children : [children]} />
                }
                if (domNode.name === "stackprojects") {
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <StackProjects data={Array.isArray(children) ? children : [children]} />
                }
                if (domNode.name === "milestonesection") {
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <MilestoneSection data={Array.isArray(children) ? children : [children]} />
                }
                if (domNode.name === "customzoomscrolleffect") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomZoomScrollEffect {...props} videourl={String(props.videourl)} />;
                }
                if (domNode.name === "customlogoscroll") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);

                    return (
                        <CustomLogoScroll {...props} data={Array.isArray(children) ? children : [children]} />
                    );
                }
                if (domNode.name === "frammerslider") {
                    const props = attributesToProps(domNode.attribs);
                    return <FrammerSlider {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "stackslider") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <StackSlider {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "customzoomeffect") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return (
                        <CustomZoomEffect {...props} data={Array.isArray(children) ? children : [children]} />
                    );
                }
                if (domNode.name === "customslider") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomSilder {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "customhorizontalscroll") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomHorizontalScroll {...props} data={Array.isArray(children) ? children : [children]} />;
                }

                if (domNode.name === "customslidercategory") {
                    const props = attributesToProps(domNode.attribs);

                    const children = domToReact(domNode.children as DOMNode[], {
                        replace(childNode) {
                            if (childNode instanceof Element) {
                                if (childNode.name === "animatedcountup") {
                                    const childProps = attributesToProps(childNode.attribs);
                                    const toValue = childProps.to ? Number(childProps.to) : 0;
                                    return <Counter to={toValue} />;
                                }
                            }
                        }
                    });

                    const childArray = Array.isArray(children) ? children : [children];

                    const categoryItems = childArray.filter(
                        (child): child is CategorySlide =>
                            React.isValidElement(child) &&
                            (child.props as CategoryItemElementProps).category !== undefined
                    );

                    return <CustomSliderCategory {...props} data={categoryItems} />;
                }
                // if (domNode.name === "categoryslider") {
                //     const props = attributesToProps(domNode.attribs);

                //     const children = domToReact(domNode.children as DOMNode[], {
                //         replace(childNode) {
                //             if (childNode instanceof Element) {
                //                 if (childNode.name === "animatedcountup") {
                //                     const childProps = attributesToProps(childNode.attribs);
                //                     const toValue = childProps.to ? Number(childProps.to) : 0;
                //                     return <Counter to={toValue} />;
                //                 }
                //             }
                //         }
                //     });

                //     const childArray = Array.isArray(children) ? children : [children];

                //     const categoryItems = childArray.filter(
                //         (child): child is CategorySlide =>
                //             React.isValidElement(child) &&
                //             (child.props as CategoryItemElementProps).category !== undefined
                //     );

                //     return <CategorySlider {...props} data={categoryItems} />;
                // }
                if (domNode.name === "categoryslider") {
                    const props = attributesToProps(domNode.attribs);

                    const children = domToReact(domNode.children as DOMNode[], {
                        replace(childNode) {
                            if (childNode instanceof Element && childNode.name === "animatedcountup") {
                                const childProps = attributesToProps(childNode.attribs);
                                return <Counter to={Number(childProps.to || 0)} />;
                            }
                        }
                    });

                    const childArray = Array.isArray(children) ? children : [children];

                    // 1. Properly cast the filtered items
                    const categoryItems = childArray.filter(
                        (child): child is CategorySlide =>
                            React.isValidElement(child) &&
                            child.props !== undefined
                    );

                    // 2. Use a Type Assertion (as any) on the component or props 
                    // to bypass the strict Attributes check in the parser
                    return (
                        <CategorySlider
                            {...(props as any)}
                            data={categoryItems}
                        />
                    );
                }


                if (domNode.name === "customsectorscroll") {
                    const props = attributesToProps(domNode.attribs);

                    const children = domToReact(domNode.children as DOMNode[], {
                        replace(childNode) {
                            if (childNode instanceof Element) {
                                if (childNode.name === "animatedcountup") {
                                    const childProps = attributesToProps(childNode.attribs);
                                    const toValue = childProps.to ? Number(childProps.to) : 0;
                                    return <Counter to={toValue} />;
                                }
                            }
                        }
                    });

                    const childArray = Array.isArray(children) ? children : [children];

                    // Filter only SlideItem
                    const slideItems = childArray.filter(
                        (child): child is SlideItem =>
                            React.isValidElement(child) &&
                            typeof (child.props as SlideItemProps).label === "string"
                    );
                    return <CustomSectorScroll {...props} data={slideItems} />;
                }

                if (domNode.name === "customsectorscrollanimate") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomSectorScrollAnimate {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "customsectorlinkslider") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomSectorLinkSlider {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "backgroundimageslider") {
                    const props = attributesToProps(domNode.attribs);
                    return <BackgroundImageSlider {...props} />;
                }
                if (domNode.name === "customtabs") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]) as CustomReactElement[];
                    const tabItems: TabItem[] = children
                        .filter((c): c is CustomReactElement => !!c && !!c.props)
                        .map((child) => ({
                            props: {
                                attribs: child.props.attribs ?? {},
                                label: child.props.label ?? '',
                                children: child.props.children ?? []
                            }
                        }));

                    return <Tabs {...props} data={tabItems} />;
                }
                if (domNode.name === "customreadmore") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <ReadMore {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "cardstack") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CardStack {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "customreadmoremodal") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);

                    return (
                        <ReadMoreModal {...props} data={Array.isArray(children) ? children : [children]} />
                    );
                }
                if (domNode.name === "scrollanimation") {
                    const props = attributesToProps(domNode.attribs);
                    const parsedChildren = domToReact(domNode.children as DOMNode[], {
                        replace: (childNode) => {
                            if (childNode instanceof Element) {
                                if (childNode.name === "animatedcountup") {
                                    const childProps = attributesToProps(childNode.attribs);
                                    const toValue = childProps.to ? Number(childProps.to) : 0;
                                    return <Counter to={toValue} />;
                                }
                            }
                        },
                    });
                    const normalizedChildren = Array.isArray(parsedChildren) ? parsedChildren : [parsedChildren];
                    return (
                        <ScrollAnimation  {...props} data={normalizedChildren} />
                    );
                }

                if (domNode.name === "customform") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomForm {...props} pageTitle={String(props.title)} component={String(props.component)} />;
                }
                if (domNode.name === "custommapindia") {
                    const props = attributesToProps(domNode.attribs);
                    return <CustomMapIndia {...props} data={domToReact(domNode.children as DOMNode[])} />;
                }
                if (domNode.name === "custommap") {
                    const props = attributesToProps(domNode.attribs);
                    return (
                        <CustomMap
                            {...props}
                            data={domToReact(domNode.children as DOMNode[], {
                                replace: (childNode) => {
                                    if (childNode instanceof Element) {
                                        if (childNode.name === "animatedcountup") {
                                            const childProps = attributesToProps(childNode.attribs);
                                            const toValue = childProps.to ? Number(childProps.to) : 0;
                                            return <Counter to={toValue} />;
                                        }
                                    }
                                },
                            })}
                        />
                    );
                }
                if (domNode.name === "customcontentslider") {
                    const props = attributesToProps(domNode.attribs);
                    const children = domToReact(domNode.children as DOMNode[]);
                    return <CustomContentSlider {...props} data={Array.isArray(children) ? children : [children]} />;
                }
                if (domNode.name === "customstickycard") {
                    const props = attributesToProps(domNode.attribs);
                    const parsedChildren = domToReact(domNode.children as DOMNode[], {
                        replace: (childNode) => {
                            if (childNode instanceof Element) {
                                if (childNode.name === "animatedcountup") {
                                    const childProps = attributesToProps(childNode.attribs);
                                    const toValue = childProps.to ? Number(childProps.to) : 0;
                                    return <Counter to={toValue} />;
                                }
                            }
                        },
                    });
                    const normalizedChildren = Array.isArray(parsedChildren) ? parsedChildren : [parsedChildren];
                    return <CustomStickyCard {...props} data={normalizedChildren} />;
                }


                // ✅ Universal fix for self-closing tags
                if (domNode instanceof Element && domNode.name?.startsWith("source")) {
                    const props = attributesToProps(domNode.attribs);
                    return <source {...props} />;
                }
                if (domNode instanceof Element && domNode.name?.startsWith("iframe")) {
                    const props = attributesToProps(domNode.attribs);
                    return <iframe {...props}></iframe>;
                }

            }

            return null;
        },
        htmlparser2: {
            lowerCaseTags: false,
            xmlMode: true,
        },
    };

    return <>{parse(data?.content, options)}</>;
};

export default PageTemplate;
