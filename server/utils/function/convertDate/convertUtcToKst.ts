export function convertUTCToKST(utcDate: Date){
    try{
        if(!utcDate || isNaN(utcDate.getTime())){
            throw new Error('잘못된 날짜 형식입니다.');
        }
        const convertKst = 60 * 9;
        return new Date(utcDate.getTime() + convertKst * 60000);
    } catch(error) {
        console.log('kst로 시간 변환을 하지 못했습니다.');
        return undefined;
    }
}