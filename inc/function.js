const axios = require('axios')
const iconv = require('iconv-lite')

const { jsonData } = require("../server")

/******************************************************
 * ID		: 다날에서 제공해 드린 CPID
 * PWD		: 다날에서 제공해 드린 CPPWD
 * ORDERID	: CP 주문정보
 ******************************************************/


/******************************************************
 * 개발용 옵션
 ******************************************************/
const Debug = jsonData.Debug
const TeleditBinPath = jsonData.TeleditBinPath

data2str = function( data ) {
    let str = ""
    data.forEach((val, key, mapObject) => str+=(key+'='+encodeURI(val)+'&'))
    return str.slice(0,-1)
}
exports.data2str = data2str

str2data = function( str ){
    const myMap = new Map()
    let query = str.split('&')
    for (elem of query) {
        let pair = elem.split('=')
        myMap.set(pair[0], pair[1])
    }
    return myMap
}
exports.str2data = str2data

const MakeFormInput = function( myMap, arr ) {
	let ret = ""

	if (arr != null) {
		for ( i in arr ) {
			if ( myMap.has(arr[i]) ){
				myMap.delete(arr[i])
			}
		}
	}
	
	for ( i of myMap ){
		var key = i[0]
		var val = i[1]
		
		ret += "<input type=\"hidden\" name=\""
		ret += key
		ret += "\" value=\""
		ret += val
		ret += "\">"
		ret += "\n"
	}

	return ret
}
exports.MakeFormInput = MakeFormInput

exports.MakeFormInputHTTP = function( HTTPVAR,arr ){
	
	let ret = ""
	let key = ""
	let val = []
	
	for ( i of Object.keys(HTTPVAR) ){
		key = i
		if ( key == arr ){
			continue
		}
		
		val = HTTPVAR[key]
		
		ret += "<input type=\"hidden\" name=\""
		ret += key
		ret += "\" value=\""
		ret += val
		ret += "\">"
		ret += "\n"
	}
	
	return ret
}
const MakeInfo = function (arr, joins=";") {
    return arr.join(joins)
}
exports.MakeInfo = MakeInfo

const MakeParam = function(mapdata) {
    let ret = []
    
    for (i of mapdata) {
        ret.push(i[0]+"="+i[1])
    }
    
    return MakeInfo(ret)
}
exports.MakeParam = MakeParam

const Parsor = function (str, sep1="\n", sep2="="){
    let out = new Map()
    let input = ""
    
    if (typeof(str)=="object") {
        for (i in str) {
            input += i+sep2+str[i]
        }
    } else {
        input = str
    }
    
    let tok = input.split(sep1)
    for(i of tok) {
        if(i !== "") {
            let tmp = i.split(sep2)
            let name = tmp[0].trim()
            let val = tmp[1].trim()

            out.set(name, decodeURI(val))
        }
    }
    return out
}

exports.GetItemName = function (CPName, nCPName, TemName, nItemName) {
    convItemName = "("+CPName.substr(0, nCPName)+")"+ItemName.substr(0,nItemName)
    return convItemName
}

exports.GetCIURL = function (IsUseCI, CIURL) {
    return IsUseCI=="Y"&&CIURL!==null ? CIURL : "https://ui.teledit.com/Danal/Teledit/Web/images/customer_logo.gif"
}

exports.Map2Str = function (arr) {
    return MakeParam(arr).join("<BR>")
}

exports.GetBgColor = function(BgColor){
    let Color = 0
    if(BgColor*1 >0 && BgColor*1 <11) {
        Color = BgColor
    }
    return (Color+"").length==1 ? "0"+Color : Color+""
}

exports.CallTeledit = async(mapdata)=>{
	
	if( Debug ) {
		//인증서 무시 옵션입니다. 테스트에만 사용해주세요.
		process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
	}
	
    let bin = "SClient"
    let arg = MakeParam( mapdata )
    
    let Input = TeleditBinPath+"/"+bin+" \""+arg+"\""
    let Output = ""
    let Ret = ""
	
	const spawn = require("child_process").spawnSync;
    const proc = spawn('sh', [
      '-c',
      Input
    ]);

    Output = iconv.decode(proc.stdout, 'euc-kr').toString()
    let MapOutput = Parsor(Output)
    Debug ? console.log('MapOutput',MapOutput) : null
    return MapOutput

}
