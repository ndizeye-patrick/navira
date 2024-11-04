import {NextResponse} from "next/server";

export async function GET(request: Request){
    const  { searchParams }  = new URL(request.url)
    const query = searchParams.get('q')

    if (!query){
        return NextResponse.json({suggestions : []});

    }
    try{
        const suggestions = [
            `${query} tutorial`,
            `${query} guide`,
            `${query} examples`,
            `${query} documentation`,
            `${query} best practices`
        ]
        return NextResponse.json({ suggestions })
    } catch (error) {
        return NextResponse.json({ suggestions: [] })
    }
}