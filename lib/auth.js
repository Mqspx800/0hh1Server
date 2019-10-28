import jwt from "jsonwebtoken";

//Use non password token to manage session, generate unique token

const APP_SECRET = "IDVSLMQPXDYNL83LLLKKK";

function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}


export const getToken = () => {
  return jwt.sign({ ID: create_UUID() }, APP_SECRET, { expiresIn: "4h" });
};

export const getUniqueID = token => {
  return token? jwt.verify(token, APP_SECRET).ID:'';
};
