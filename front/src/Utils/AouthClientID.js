export default function getGithubID() {
  let clientID = process.env.REACT_APP_ClientID;
  if (clientID == null) {
    clientID = process.env.ClientID;
  }
  return clientID;
}
