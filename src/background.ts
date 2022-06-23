const CLIENT_ID = '75958338512e4ba98a507189e5fd8f69'
const RESPONSE_TYPE = encodeURIComponent('token')
const REDIRECT_URI = chrome.identity.getRedirectURL()

const SHOW_DIALOG = encodeURIComponent('true')
let STATE = encodeURIComponent(
  'meet' + Math.random().toString(36).substring(2, 15)
)
let ACCESS_TOKEN = ''

const SPACE_DELIMITER = '%20'
const SCOPES = ['user-read-private', 'user-library-read']
const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER)

let user_signed_in = false

function is_user_signed_in() {
  return user_signed_in
}

function create_auth_endpoint() {
  let openId_endpoint_url = `https://accounts.spotify.com/authorize
		?client_id=${CLIENT_ID}
		&response_type=${RESPONSE_TYPE}
		&redirect_uri=${REDIRECT_URI}
		&scope=${SCOPES_URL_PARAM}
		&show_dialog=${SHOW_DIALOG}
		`
  return openId_endpoint_url
}

const getReturnedParamsFromSpotifyAuth = (hash: any) => {
  const stringAfterHashtag = hash.split('#')[1]
  const paramsInUrl = stringAfterHashtag.split('&')
  const paramsSplitUp = paramsInUrl.reduce(
    (accumulator: any, currentValue: any) => {
      const [key, value] = currentValue.split('=')
      accumulator[key] = value
      return accumulator
    },
    {}
  )
  return paramsSplitUp
}

https: chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'login') {
    if (user_signed_in) {
      sendResponse({ message: 'success', token: ACCESS_TOKEN })
    } else {
      chrome.identity.launchWebAuthFlow(
        {
          url: create_auth_endpoint(),
          interactive: true
        },
        (redirect_url) => {
          console.log(redirect_url)
          if (chrome.runtime.lastError) {
            // problem signing in
            console.log('PROBLEM SIGNING IN')
          } else {
            const { access_token, expires_in, token_type } =
              getReturnedParamsFromSpotifyAuth(redirect_url)

            ACCESS_TOKEN = access_token

            user_signed_in = true

            setTimeout(() => {
              ACCESS_TOKEN = ''
              user_signed_in = false
            }, 1000 * 60 * 60)

            sendResponse({ message: 'success', token: ACCESS_TOKEN })
          }
        }
      )

      return true
    }
  }
  // else if (request.message === 'logout') {
  //   user_signed_in = false
  //   chrome.browserAction.setPopup({ popup: './popup.html' }, () => {
  //     sendResponse('success')
  //   })

  //   return true
  // } else if (request.message === 'isUserSignedIn') {
  //   sendResponse(is_user_signed_in())
  // }
})
