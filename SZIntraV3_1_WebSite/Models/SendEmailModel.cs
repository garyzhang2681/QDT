using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SZIntraV3_1_WebSite.Models
{
    public class SendEmailModel
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public EmailType EmailType { get; set; }

    }
}