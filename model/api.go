package model

import "time"

// ATDN http://api.atnd.org/
type ATDN struct {
	ResultsReturned int `json:"results_returned"`
	ResultsStart    int `json:"results_start"`
	Events          []struct {
		Event struct {
			EventID        int         `json:"event_id"`
			Title          string      `json:"title"`
			Catch          string      `json:"catch"`
			Description    string      `json:"description"`
			EventURL       string      `json:"event_url"`
			StartedAt      time.Time   `json:"started_at"`
			EndedAt        interface{} `json:"ended_at"`
			URL            interface{} `json:"url"`
			Limit          int         `json:"limit"`
			Address        string      `json:"address"`
			Place          string      `json:"place"`
			Lat            string      `json:"lat"`
			Lon            string      `json:"lon"`
			OwnerID        int         `json:"owner_id"`
			OwnerNickname  string      `json:"owner_nickname"`
			OwnerTwitterID string      `json:"owner_twitter_id"`
			Accepted       int         `json:"accepted"`
			Waiting        int         `json:"waiting"`
			UpdatedAt      time.Time   `json:"updated_at"`
		} `json:"event"`
	} `json:"events"`
}

// Connpass https://connpass.com/about/api/
type Connpass struct {
	ResultsReturned int `json:"results_returned"`
	Events          []struct {
		EventURL      string `json:"event_url"`
		EventType     string `json:"event_type"`
		OwnerNickname string `json:"owner_nickname"`
		Series        struct {
			URL   string `json:"url"`
			ID    int    `json:"id"`
			Title string `json:"title"`
		} `json:"series"`
		UpdatedAt        time.Time `json:"updated_at"`
		Lat              string    `json:"lat"`
		StartedAt        time.Time `json:"started_at"`
		HashTag          string    `json:"hash_tag"`
		Title            string    `json:"title"`
		EventID          int       `json:"event_id"`
		Lon              string    `json:"lon"`
		Waiting          int       `json:"waiting"`
		Limit            int       `json:"limit"`
		OwnerID          int       `json:"owner_id"`
		OwnerDisplayName string    `json:"owner_display_name"`
		Description      string    `json:"description"`
		Address          string    `json:"address"`
		Catch            string    `json:"catch"`
		Accepted         int       `json:"accepted"`
		EndedAt          time.Time `json:"ended_at"`
		Place            string    `json:"place"`
	} `json:"events"`
	ResultsStart     int `json:"results_start"`
	ResultsAvailable int `json:"results_available"`
}

// Doorkeeper https://www.doorkeeperhq.com/developer/api
type Doorkeeper []struct {
	Event struct {
		Title        string      `json:"title"`
		ID           int         `json:"id"`
		StartsAt     time.Time   `json:"starts_at"`
		EndsAt       time.Time   `json:"ends_at"`
		VenueName    string      `json:"venue_name"`
		Address      string      `json:"address"`
		Lat          string      `json:"lat"`
		Long         string      `json:"long"`
		TicketLimit  interface{} `json:"ticket_limit"`
		PublishedAt  time.Time   `json:"published_at"`
		UpdatedAt    time.Time   `json:"updated_at"`
		Group        int         `json:"group"`
		Banner       string      `json:"banner"`
		Description  string      `json:"description"`
		PublicURL    string      `json:"public_url"`
		Participants int         `json:"participants"`
		Waitlisted   int         `json:"waitlisted"`
	} `json:"event"`
}
