import Link from "next/link";

export default function Navbar() {
    return (
        <div className="navbar">
            <ol>
                <li><Link href="/asset_type">유형별 자산관리</Link></li>
                <li><Link href="/asset_class">분류별 자산관리</Link></li>
            </ol>
        </div>
    )
}
