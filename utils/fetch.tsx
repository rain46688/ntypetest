// Post 함수
// data : 데이터 json 형식, url : 요청 뒷부분 url 예시 http://localhost:3000/(뒷부분 url)
export function sendPost(data: string, url: string): Promise<any> {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    }

    return fetch(process.env.NEXT_PUBLIC_API_URL + url, options)
        .then((res) => res.json())
        .then((result) => {
            if (result.status === 'success') {
                console.log(" === API Success === ");
                return result;
            } else {
                console.log(" === API Error === ");
                return { 'status': 'fail' }
            }
        })
        .catch((error) => {
            console.log(" === API Error : ", error);
            return { 'status': 'fail' }
        });
};