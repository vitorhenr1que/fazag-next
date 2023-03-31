import Link from "next/link"
interface LinkHeaderProps {
    closeToggle: () => void;
    url: string;
    linkName: string 
}
export function LinkHeaderNavLink({closeToggle, url, linkName}: LinkHeaderProps){
    return (
            <Link href={url} className={"dropdown-item"} onClick={closeToggle}>{linkName}</Link>
        )
}