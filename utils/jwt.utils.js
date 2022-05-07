// Imports
const jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = '0gefd5vdys66gvekxo9fff782kdyd';

// Exported functions
module.exports = {
    generateTokenForAdmin: function(adminData, res) {
        
        return jwt.sign({
            idadmin: adminData.idadmin,  
        },
        JWT_SIGN_SECRET,
        {
            expiresIn: '1h'
        })   
    },
    parseAuthorization: function(authorization) {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
      },
    getAdminId: async function(authorization) {
        let idadmin = -1;
        const token = module.exports.parseAuthorization(authorization);
        if(token != null) {
          try {
            const jwtToken = await jwt.verify(token, JWT_SIGN_SECRET);
            console.log(jwtToken)
            if(jwtToken != null)
              idadmin= jwtToken.idadmin;
              return idadmin;    
          } catch(err) { return err }
        }else {
          return -10
        }
      }
    }