const ID  = "A010002002" // TEST ID 입니다. 다날에서 발급 후 교체해주세요
const PWD = "bbbbb" // TEST PWD 입니다. 다날에서 발급 후 교체해주세요
const AMOUNT = 301
const CPName = "가맹점이름"
const ItemCode = "1270000000"
const ItemName = "상품이름"
const ItemInfo = ItemCode[0]+"|"+AMOUNT+"|1|"+ItemCode+"|"+ItemName
const serverAddr = "https://tdbnodejs.run.goorm.io"

const SUBCP = ""
const USERID = ""
const ORDERID = ""
const IsPreOtbill = "N"
const IsSubscript = "N"

// ByPassValue
const BgColor = "00"
const TargetURL = "CPCGI.php"
const BackURL = "BackURL.php"
const IsUseCI = "N"
const CIURL = "images/ci.gif"

const Email = ""
const IsCharSet = "EUC-KR"
const ByBuffer = "This value bypass to CPCGI Page"
const ByAnyName = "Anyvalue"

global.ID = ID
global.PWD = PWD
global.AMOUNT = AMOUNT
global.ItemAmt = AMOUNT
global.CPName = CPName
global.ORDERID = ORDERID
global.ItemCode = ItemCode
global.ItemName = ItemName
global.ItemInfo = ItemInfo
global.serverAddr = serverAddr
global.SUBCP = SUBCP
global.USERID = USERID
global.ORDERID = ORDERID
global.IsPreOtbill = IsPreOtbill
global.IsSubscript = IsSubscript
global.BgColor = BgColor
global.TargetURL = TargetURL
global.BackURL = BackURL
global.IsUseCI = IsUseCI
global.CIURL = CIURL
global.Email = Email
global.IsCharSet = IsCharSet
global.ByBuffer = ByBuffer
global.ByAnyName = ByAnyName