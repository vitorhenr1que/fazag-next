import Link from "next/link"
interface LinkHeaderProps {
    closeToggle: () => void;
    url: string;
    linkName: string 
}
export function LinkHeader({closeToggle, url, linkName}: LinkHeaderProps){
    return (
        <li>
            <Link href={url} className={"dropdown-item"} onClick={closeToggle}>{linkName}</Link>
        </li>
        )
}