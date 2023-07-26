import Link from "next/link"
interface LinkHeaderProps {
    closeToggle: () => void;
    url: string;
    linkName: string;
    target?: string
}
export function LinkHeader({closeToggle, url, linkName, target}: LinkHeaderProps){
    return (
        <li>
            <Link href={url} target={target} className={"dropdown-item"} onClick={closeToggle}>{linkName}</Link>
        </li>
        )
}