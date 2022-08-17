exports.CPCGIFunction = async (req)=> {
    const { CallTeledit, data2str, MakeFormInput, MakeFormInputHTTP } = require("./inc/function")
    const { jsonData } = require("./server")
	
	const TransR = new Map()
	const ServerInfo = req["ServerInfo"]
	
    const ID = jsonData.ID
    const ItemAmt = jsonData.ItemAmt
    const Debug = jsonData.Debug
    /*
     * * NCONFIRM : 결제 전 모든 정보 재확인 단계
     *
	 * - nConfirmOption - CPID, ORDERID 체크 여부
	 *		0 : NONE( default )
	 *		1 : CPID 및 ORDERID 체크
	 */
    
	let nConfirmOption = 0
	let BillErr = false
    let BillErrRes = ""
	
	TransR.set( "Command", "NCONFIRM" )
	TransR.set( "OUTPUTOPTION", "DEFAULT" )
    TransR.set( "ServerInfo", ServerInfo )
    TransR.set( "IFVERSION", "V1.1.2" )
	TransR.set( "CONFIRMOPTION", nConfirmOption )

	/*
	 * nConfirmOption이 1이면 CPID, ORDERID 필수 전달
	 */
	if( nConfirmOption == 1 )
	{
		TransR.set( "CPID", ID )
		TransR.set( "AMOUNT", ItemAmt )
	}

	let out = await CallTeledit( TransR )
    /******************************************************
     ** true일경우 웹브라우져에 debugging 메시지를 출력합니다.
     ******************************************************/
    if( Debug )
    {
        console.log( "REQ[" + data2str(TransR) + "]<BR>" )
        console.log( "RES[" + data2str(out) + "]<BR>" )
    }

    if( out.get("Result") == "0" ){
        /**************************************************************************
         *
         * NBILL - 결제 정보 모두 확인 완료, 최종 결제 단계
         *
         **************************************************************************/
        const TransRBill = new Map()
        
        let nBillOption = 0
        TransRBill.set("Command","NBILL")
        TransRBill.set("OUTPUTOPTION","DEFAULT")
        TransRBill.set("ServerInfo",ServerInfo)
        TransRBill.set("IFVERSION","V1.1.2")
        TransRBill.set("BillOption",nBillOption)

        let outBill = await CallTeledit(TransRBill)
        
        if( Debug )
        {
            console.log( "REQ[" + data2str(TransRBill) + "]<BR>" )
            console.log( "RES[" + data2str(outBill) + "]<BR>" )
        }
        
        if (outBill.get("Result") !="0") {
            BillErr = true
            BillErrRes = outBill
        } else {

            /**************************************************************************
            *
            * 결제 완료에 대한 작업 
            * - AMOUNT, ORDERID 등 결제 거래내용에 대한 검증을 반드시 하시기 바랍니다.
            * - CAP, RemainAmt: 개인정보 정책에 의해 잔여 한도 금액은 미전달 됩니다. (“000000”)
            *
            **************************************************************************/

                const resform = '<form name="Success" action="/Success" method="post">'
                    + MakeFormInput(out, ["Result","ErrMsg"] )
                    + MakeFormInput(outBill, ["Result","ErrMsg"] )
                    + '</form>'
                    + '<script>'
                    + 'document.Success.submit()'
                    + '</script>'

                return resform                
            }              

    } else{
    /**************************************************************************
     *
     * 인증 실패에 대한 작업
     *
     **************************************************************************/
        if (BillErr) out = BillErrRes

        let retstr = '<center>'
            +'인증 서비스 에러'
            +'<br>'
            +'에러코드 : ' + out.get("Result")
            +'<br>'
            +'에러메시지 : ' + out.get("ErrMsg")
            +'</center>'

        const resform = '<form name="CPCGI" action="/Error" method="post">'
                + MakeFormInputHTTP(req,"TID")
                + MakeFormInput(out, ["Result","ErrMsg"] )
                + '</form>'
                + '<script>'
                + 'document.CPCGI.submit()'
                + '</script>'

        return resform

        return 
    }
}

