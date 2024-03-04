import Link from 'next/link';

export default function not_found() {
    return (
        <>
            <h1>404 - Not Found</h1>
            <Link href={''+process.env.NEXT_PUBLIC_ROOT_URL}>Go back to Main</Link>
        </>
    )
}
