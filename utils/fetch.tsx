import axios from 'axios';

/**
 * sendPost 함수 : POST 요청을 보내는 함수
 * @param {string} data - 요청 데이터
 * @param {string} url - 요청 URL
 * @returns {Promise<any>} - API 요청 결과
 */
export function sendPost(data: string, url: string): Promise<any> {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: data,
    };

    return axios(process.env.NEXT_PUBLIC_API_URL + url, options)
        .then((response) => {
            const result = response.data;
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