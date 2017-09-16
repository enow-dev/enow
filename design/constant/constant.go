package constant

//---------------------------------------------
// UserTrait
//---------------------------------------------
const (
	AdminUserTrait        = "AdminUserTrait"
	GeneralUserTrait      = "GeneralUserTrait"
	GuestUserTrait        = "GuestUserTrait"
	PaginatorHeaderTrait  = "PaginatorHeaderTrait"
	PaginatorHeaderTrait2 = "PaginatorHeaderTrait2"
	GAECronTrait          = "PaginatorHeader"
)

//---------------------------------------------
// etc
//---------------------------------------------

const (
	AtndID = iota + 1
	ConnpassID
	DoorkeeperID
)

const (
	Atnd       = "atnd"
	Connpass   = "connpass"
	Doorkeeper = "doorkeeper"
)

const SearchPeriod = 1

//---------------------------------------------
// etc
//---------------------------------------------

const (
	InternalErr   = "サーバーとの通信中にエラーが発生しました type: %s code: %d"
	BadRequestErr = "リクエスト内容に不備があります type: %s code: %d"
)
