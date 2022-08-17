exports.ReadyFunction = async ()=>{
    
    const { CallTeledit, data2str, MakeFormInput, MakeFormInputHTTP } = require("./inc/function")
    const { jsonData } = require("./server")
	
	const CHARSET = jsonData.IsCharSet
    const ID = jsonData.ID
    const PWD = jsonData.PWD
    const CPName = jsonData.CPName
    const ItemName = jsonData.ItemName
    const ItemAmt = jsonData.ItemAmt
    const ItemCode = jsonData.ItemCode
    const ItemInfo = ItemCode[0] +'|'+ ItemAmt +'|1|'+ ItemCode +'|'+ ItemName
    const serverAddr = jsonData.serverAddr
    
    const Debug = jsonData.Debug
    
    const iconv = require('iconv-lite')
	
    /********************************************************************************
	 *
	 * [ 전문 요청 데이터 ] *********************************************************
	 *
	 ********************************************************************************/
    const TransR = new Map()
    
	/******************************************************
	 ** 아래의 데이터는 고정값입니다.( 변경하지 마세요 )
	 * Command      : ITEMSEND2
	 * SERVICE      : TELEDIT
	 * ItemCount    : 1
	 * OUTPUTOPTION : DEFAULT 
	 ******************************************************/
	TransR.set( "Command", "ITEMSEND2" )
	TransR.set( "SERVICE", "TELEDIT" )
	TransR.set( "ItemCount", "1" )
    TransR.set( "OUTPUTOPTION ", "DEFAULT" )

	/******************************************************
	 *  ID          : 다날에서 제공해 드린 ID
	 *  PWD         : 다날에서 제공해 드린 PWD
	 *  CPNAME      : CP 명
     *  ItemInfo    : 상품 정보를 한줄 코드로 정리한 형식 ( 상세사항은 메뉴얼 참조 )
	 ******************************************************/
	TransR.set( "ID", ID )
	TransR.set( "PWD", PWD )
    TransR.set( "CPName", CPName )
    TransR.set( "ItemInfo", ItemInfo )

	/***[ 선택 사항 ]**************************************/
	/******************************************************
	 * SUBCP		: 다날에서 제공해드린 SUBCP ID
	 * USERID		: 사용자 ID
	 * ORDERID		: CP 주문번호
	 * IsPreOtbill		: AuthKey 수신 유무(Y/N) (재승인, 월자동결제를 위한 AuthKey 수신이 필요한 경우 : Y)
	 * IsSubscript		: 월 정액 가입 유무(Y/N) (월 정액 가입을 위한 첫 결제인 경우 : Y)
	 ******************************************************/
	//TransR.set( "SUBCP", jsonData.SUBCP )
    //TransR.set( "USERID", jsonData.USERID )
	//TransR.set( "ORDERID", jsonData.ORDERID )
	//TransR.set( "IsPreOtbill", jsonData.IsPreOtbill )
    //TransR.set( "IsSubscript", jsonData.IsSubscript )

	/********************************************************************************
	 *
	 * [ CPCGI에 HTTP POST로 전달되는 데이터 ] **************************************
	 *
	 ********************************************************************************/
	 
	/***[ 필수 데이터 ]************************************/
	const ByPassValue = new Map()

	/******************************************************
	 * BgColor      : 결제 페이지 Background Color 설정
	 * TargetURL    : 최종 결제 요청 할 CP의 CPCGI FULL URL
	 * BackURL      : 에러 발생 및 취소 시 이동 할 페이지의 FULL URL
	 * IsUseCI      : CP의 CI 사용 여부( Y or N )
	 * CIURL        : CP의 CI FULL URL
	 ******************************************************/
	ByPassValue.set( "BgColor", "00" )
	ByPassValue.set( "TargetURL", serverAddr + jsonData.TargetURL)
	ByPassValue.set( "BackURL", serverAddr + jsonData.BackURL )
	ByPassValue.set( "IsUseCI", jsonData.IsUseCI )
    ByPassValue.set( "CIURL", serverAddr + jsonData.CIURL )

	/***[ 선택 사항 ]**************************************/
	/******************************************************
	* Email	: 사용자 E-mail 주소 - 결제 화면에 표기
	 * IsCharSet	: CP의 Webserver Character set
     ** CPCGI에 POST DATA로 전달 됩니다.
	 **
	 ******************************************************/
	ByPassValue.set( "Email", "user@cp.co.kr" )
    ByPassValue.set( "IsCharSet", CHARSET )
    ByPassValue.set( "ByBuffer", "This value bypass to CPCGI Page")
	ByPassValue.set( "ByAnyName", "AnyValue" )
    
    console.log("TransR",TransR)
    

    let out = await CallTeledit( TransR )
    if( out.get("Result") == "0" ) {

        /******************************************************
        *
        * 가맹점 인증 후 TID 전송,
        * 결제창 응답
        * 
        ******************************************************/								
        let resform = '<form name="Ready" action="https://ui.teledit.com/Danal/Teledit/Web/Start.php" method="post">\n'
                        + MakeFormInput(out,["Result","ErrMsg"])
                        + MakeFormInput(ByPassValue, null)
                        + '<input type="hidden" name="CPName"      value='+CPName+'>'
                        + '<input type="hidden" name="ItemName"    value='+ItemName+'>'
                        + '<input type="hidden" name="ItemAmt"     value='+ItemAmt+'>'
                        + '<input type="hidden" name="IsPreOtbill" value='+"N"+'>'
                        + '<input type="hidden" name="IsSubscript" value='+"N"+'>'
                        + '</form>\n'
                        + '<script>'
        				//+ 'alert('+TransR+')'
                        + 'document.Ready.submit()'
                        + '</script>'
    	Debug ? console.log(resform) : null
        return resform

    } else {
        /**************************************************************************
        *
        * 인증 실패에 대한 작업
        *
        **************************************************************************/

        let retstr = ''
        +'<center>'
        +'인증 서비스 에러'
        +'<br>'
        +'에러코드 : ' + out.get("Result")
        +'<br>'
        +'에러메시지 : ' + out.get("ErrMsg")
        +'</center>'

        return retstr
    }
 }