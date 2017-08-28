package constant

//---------------------------------------------
// UserTrait
//---------------------------------------------
const (
	AdminUserTrait   = "AdminUserTrait"
	GeneralUserTrait = "GeneralUserTrait"
	PaginatorHeader  = "PaginatorHeader"
)

//---------------------------------------------
// etc
//---------------------------------------------

const (
	ATDN_ID = iota + 1
	CONNPASS_ID
	DOORKEEPER_ID
)

const (
	ATDN_URL = "https://api.atnd.org/events/?count=100&format=jsonp&callback="
	CONNPASS_URL = "https://connpass.com/api/v1/event/?count=100"
	DOORKEEPER_URL = "https://api.doorkeeper.jp/events"
)

const SERACH_SCOPE = 1
