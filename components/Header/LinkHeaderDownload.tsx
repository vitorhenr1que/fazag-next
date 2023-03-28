import Link from "next/link"
interface LinkHeaderProps {
    closeToggle: () => void;
    url: string;
    linkName: string;
    download: string;
}
export function LinkHeaderDownload({closeToggle, url, linkName, download}: LinkHeaderProps){
    return (
        <li>
            <Link href={url} download={download} className={"dropdown-item"} onClick={closeToggle}>{linkName}</Link>
        </li>
        )
}