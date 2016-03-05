package grandprix

import (

)

// EmailScope is Google's OAuth 2.0 email scope
// EmailScope = "https://www.googleapis.com/auth/userinfo.email"

type RootService struct {
}

func init() {

}
// func init() {
// 	rs := &RootService{}
// 	api, err := endpoints.RegisterService(rs, "dailyfinance", "v1", "Services for dailyfinance", true)
// 	if err != nil {
// 		panic(err.Error())
// 	}

// 	registerCategoryServices(api)
// 	registerStoreServices(api)
// 	registerTicketServices(api)
// 	// registerSumServices(api)

// 	endpoints.HandleHTTP()

// 	http.HandleFunc("/out", out)

// }

// func CurrentUser(r *http.Request) (u *user.User, err error) {
// 	c := endpoints.NewContext(r)
// 	u, err = endpoints.CurrentUser(c,
// 		[]string{endpoints.EmailScope},
// 		[]string{
// 			"120288103368-9ba8linfgfgf4uubeucaq9cvvroc851s.apps.googleusercontent.com",
// 			"120288103368-4ngsr31cf3s2ikce38gcpih1h5kk6oeb.apps.googleusercontent.com"},
// 		[]string{endpoints.APIExplorerClientID,
// 			"120288103368-4ngsr31cf3s2ikce38gcpih1h5kk6oeb.apps.googleusercontent.com",
// 			"120288103368-9ba8linfgfgf4uubeucaq9cvvroc851s.apps.googleusercontent.com"})
// 	if err != nil {
// 		err = fmt.Errorf("No user logged on. " + err.Error())
// 		return
// 	}
// 	return
// }

// func out(w http.ResponseWriter, r *http.Request) {
// 	c := appengine.NewContext(r)
// 	u := user.Current(c)
// 	if u != nil {
// 		url, err := user.LogoutURL(c, "/out")
// 		if err != nil {
// 			http.Error(w, err.Error(), http.StatusInternalServerError)
// 			return
// 		}
// 		w.Header().Set("Location", url)
// 		w.WriteHeader(http.StatusFound)
// 		return
// 	}
// 	fmt.Fprintf(w, "Du er logget ud. ")
// }
