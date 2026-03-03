"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CustomSilder from "@/utils/CustomSilder";

const Filters = ({ compSlug }: any) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const countiesArray = [
        "All",
        "India",
        "Oman",
        "Czech Republic",
        "Botswana",
        "Mozambique",
        "Cameroon",
        "UAE",
        "UK",
        "South Africa"
    ]



    const handleCountrySelect = (country: string) => {
        const params = new URLSearchParams(searchParams.toString());

        params.delete("page");
        if (country === "All") {
            params.delete("country");
            params.delete("taxonomy");
        } else {
            params.set("country", country);
            params.set("taxonomy", compSlug);
        }

        router.replace(`?${params.toString()}`, { scroll: false });
    };
    return (
        <>
            {compSlug == 'nj-offices' && (
                <>
                    <div className="position-relative">
                        <CustomSilder arrows="true" customcls="buttons_absolute" items="[6,3,2]" cls="mb-5">
                            {countiesArray.map((country, index) => (
                                <div key={index} onClick={() => handleCountrySelect(country)} className="c-sector__item cursor-pointer">
                                    <span className="c-sector__item_label">{country}</span>
                                    <span className="c-sector__item_border"></span>
                                </div>
                            ))}
                        </CustomSilder>
                    </div>

                </>
            )}
        </>
    )
}

export default Filters;