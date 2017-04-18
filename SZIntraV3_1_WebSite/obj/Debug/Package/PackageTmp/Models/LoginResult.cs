using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;

namespace SZIntraV3_1_WebSite.Models
{
    public class LoginResult
    {
        public bool success { get; set; }
        public string errorMessage { get; set; }
        public User user { get; set; }

        public LoginResult() { }
        public LoginResult(bool success, string errorMessage, User user)
        {
            this.success = success;
            this.errorMessage = errorMessage;
            this.user = user;
        }
    }

}