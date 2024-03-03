import Link from 'next/link';

export default function not_found() {
    return (
        <>
            <h1>404 - Not Found</h1>
            <Link href="/">Go back to Main</Link>
        </>
    )
}
